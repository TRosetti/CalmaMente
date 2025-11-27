package com.calmamente.backend.repository;

import com.calmamente.backend.model.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, UUID> {
    List<Agendamento> findByPacienteId(UUID pacienteId);

    List<Agendamento> findByProfissionalId(UUID profissionalId);

    List<Agendamento> findByProfissionalIdAndDataHoraBetween(UUID profissionalId, LocalDateTime inicio, LocalDateTime fim);
    
    List<Agendamento> findByPacienteIdOrderByDataHoraAsc(UUID pacienteId);

    List<Agendamento> findByProfissionalIdOrderByDataHoraAsc(UUID profissionalId);

    long deleteByPacienteId(UUID pacienteId);

    long deleteByProfissionalId(UUID profissionalId);

    // Objetivo: Verificar se existe conflito de horário, considerando que cada consulta tem exatamente 60 minutos.
    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN TRUE ELSE FALSE END FROM Agendamento a " +
            "WHERE a.profissional.id = :profissionalId " +
            "AND a.status <> com.calmamente.backend.model.StatusAgendamento.cancelado " +
            "AND a.dataHora > :horarioLimiteInferior " + 
            "AND a.dataHora < :horarioLimiteSuperior")
        boolean existeConflitoDeHorario(@Param("profissionalId") UUID profissionalId,
                                        @Param("horarioLimiteInferior") LocalDateTime horarioLimiteInferior,
                                        @Param("horarioLimiteSuperior") LocalDateTime horarioLimiteSuperior);}