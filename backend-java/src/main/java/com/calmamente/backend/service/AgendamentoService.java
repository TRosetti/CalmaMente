package com.calmamente.backend.service;

import com.calmamente.backend.model.Agendamento;
import com.calmamente.backend.model.Usuario;
import com.calmamente.backend.model.TipoUsuario;
import com.calmamente.backend.model.StatusAgendamento; 
import com.calmamente.backend.repository.AgendamentoRepository;
import com.calmamente.backend.repository.UsuarioRepository;
import com.calmamente.backend.exception.RegraNegocioException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.time.temporal.ChronoUnit;

@Service
public class AgendamentoService {

    @Autowired
    private AgendamentoRepository repository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private static final int DURACAO_CONSULTA_MINUTOS = 60;
    private static final int HORA_ABERTURA = 7;
    private static final int HORA_FECHAMENTO = 18;

    public Agendamento criarAgendamento(Agendamento agendamento) {
        // 1. Validações de Regras de Negócio (48h, Horário Comercial, etc)
        validarRegrasDeHorario(agendamento.getDataHora());

        // 2. Validação de Conflito no Banco
        validarConflitoDeHorario(agendamento);

        return repository.save(agendamento);
    }

    public void cancelarAgendamento(UUID agendamentoId) {
        Agendamento agendamento = repository.findById(agendamentoId)
            .orElseThrow(() -> new RegraNegocioException("Agendamento não encontrado."));

        // 1. Verifica se já não estava cancelado
        if (agendamento.getStatus() == StatusAgendamento.cancelado) {
            throw new RegraNegocioException("Este agendamento já se encontra cancelado.");
        }

        // 2. Verifica a Regra das 24 Horas
        LocalDateTime limiteMinimoCancelamento = LocalDateTime.now().plusHours(24);
        
        if (agendamento.getDataHora().isBefore(limiteMinimoCancelamento)) {
            throw new RegraNegocioException("Cancelamentos só são permitidos com 24h de antecedência. Entre em contato com a clínica.");
        }

        // 3. Aplica o Cancelamento lógico
        agendamento.setStatus(StatusAgendamento.cancelado);
        repository.save(agendamento);
    }

    private void validarRegrasDeHorario(LocalDateTime dataHora) {
        // A. Regra de Antecedência Mínima (48h)
        LocalDateTime limiteMinimo = LocalDateTime.now().plusHours(48);
        
        if (dataHora.isBefore(limiteMinimo)) {
            throw new RegraNegocioException("O agendamento deve ser feito com no mínimo 48 horas de antecedência.");
        }

        // B. Bloqueio de Finais de Semana
        if (dataHora.getDayOfWeek() == DayOfWeek.SUNDAY || dataHora.getDayOfWeek() == DayOfWeek.SATURDAY) {
            throw new RegraNegocioException("A clínica não funciona aos finais de semana.");
        }

        // C. Bloqueio de Horário Comercial
        int hora = dataHora.getHour();
        if (hora < HORA_ABERTURA || hora >= HORA_FECHAMENTO) {
            throw new RegraNegocioException("Horário inválido. O funcionamento é das 07:00 às 18:00.");
        }
    }

    private void validarConflitoDeHorario(Agendamento novoAgendamento) {
        LocalDateTime inicioDesejado = novoAgendamento.getDataHora();
        UUID profissionalId = novoAgendamento.getProfissional().getId();

        LocalDateTime horarioLimiteInferior = inicioDesejado.minusMinutes(DURACAO_CONSULTA_MINUTOS);
        LocalDateTime horarioLimiteSuperior = inicioDesejado.plusMinutes(DURACAO_CONSULTA_MINUTOS);

        boolean existeConflito = repository.existeConflitoDeHorario(
            profissionalId,
            horarioLimiteInferior,
            horarioLimiteSuperior
        );

        if (existeConflito) {
            throw new RegraNegocioException("Conflito de horário. O profissional já possui um agendamento neste intervalo.");
        }
    }

    public List<Agendamento> listarTodos() {
        return repository.findAll();
    }

    public List<Agendamento> listarOcupados(UUID medicoId, LocalDateTime inicio, LocalDateTime fim) {
        return repository.findByProfissionalIdAndDataHoraBetween(medicoId, inicio, fim);
    }
    
    public List<Agendamento> listarMinhasConsultas(UUID usuarioId) {        
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        if (usuario.getTipo() == TipoUsuario.profissional) {            
            return repository.findByProfissionalIdOrderByDataHoraAsc(usuarioId);
        } else {            
            return repository.findByPacienteIdOrderByDataHoraAsc(usuarioId);
        }
    }

    public long excluirAgendamentosPorUsuario(UUID usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (usuario.getTipo() == TipoUsuario.profissional) {
            return repository.deleteByProfissionalId(usuarioId);
        } else {
            return repository.deleteByPacienteId(usuarioId);
        }
    }

    public List<LocalTime> listarHorariosDisponiveis(UUID medicoId, LocalDate data) {
        // 1. Definições da Clínica (Poderiam vir de config)
        LocalTime inicioExpediente = LocalTime.of(HORA_ABERTURA, 0); 
        LocalTime fimExpediente = LocalTime.of(HORA_FECHAMENTO, 0);  
        
        // 2. Buscamos todos os agendamentos desse dia (00:00 até 23:59)
        LocalDateTime inicioDia = data.atStartOfDay();
        LocalDateTime fimDia = data.atTime(LocalTime.MAX);

        // Reutilizamos o método do repositório que já existe
        List<Agendamento> agendamentosDoDia = repository.findByProfissionalIdAndDataHoraBetween(
            medicoId, inicioDia, fimDia
        );

        // 3. Lista de horários ocupados (apenas os ativos)
        List<LocalTime> horariosOcupados = agendamentosDoDia.stream()
            .filter(a -> a.getStatus() != StatusAgendamento.cancelado) // Ignora cancelados
            .map(a -> a.getDataHora().toLocalTime()) // Extrai apenas a hora (ex: 08:00)
            .toList();

        // 4. Gerar lista de disponíveis
        List<LocalTime> horariosDisponiveis = new ArrayList<>();
        LocalTime slotAtual = inicioExpediente;

        while (slotAtual.isBefore(fimExpediente)) {
            
            // Regra A: O horário está livre? (Não está na lista de ocupados)
            boolean estaLivre = !horariosOcupados.contains(slotAtual);

            // Regra B: Se a data for HOJE, o horário já passou?
            boolean horarioJaPassou = data.equals(LocalDate.now()) && slotAtual.isBefore(LocalTime.now());

            if (estaLivre && !horarioJaPassou) {
                horariosDisponiveis.add(slotAtual);
            }

            // Avança 1 hora (Duração da consulta)
            slotAtual = slotAtual.plusMinutes(DURACAO_CONSULTA_MINUTOS);
        }

        return horariosDisponiveis;
    }
}