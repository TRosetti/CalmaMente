package com.calmamente.backend.service;

import com.calmamente.backend.model.Medico;
import com.calmamente.backend.repository.MedicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicoService {

    @Autowired
    private MedicoRepository medicoRepository;

    // REMOVIDO: cadastrarMedico (Agora quem faz isso é o AuthService.registrarMedico)
    // REMOVIDO: buscarUsuarioComRetry (Não é mais necessário, pois criamos tudo na mesma transação)

    /**
     * Busca médicos com filtros opcionais de nome e especialidade.
     */
    public List<Medico> buscarMedicos(String nome, String especialidade) {
        if (nome != null && !nome.isBlank() && especialidade != null && !especialidade.isBlank()) {
            return medicoRepository.findByUsuario_NomeContainingIgnoreCaseAndEspecialidadeContainingIgnoreCase(nome, especialidade);
        }
        if (nome != null && !nome.isBlank()) {
            return medicoRepository.findByUsuario_NomeContainingIgnoreCase(nome);
        }
        if (especialidade != null && !especialidade.isBlank()) {
            return medicoRepository.findByEspecialidadeContainingIgnoreCase(especialidade);
        }
        return medicoRepository.findAll();
    }
}