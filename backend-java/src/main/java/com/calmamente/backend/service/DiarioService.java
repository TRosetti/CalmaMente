


package com.calmamente.backend.service;

import com.calmamente.backend.model.Diario;
import com.calmamente.backend.model.Usuario; // Importar Usuario
import com.calmamente.backend.repository.DiarioRepository;
import com.calmamente.backend.repository.UsuarioRepository; // ✅ Importar UsuarioRepository
import com.calmamente.backend.dto.DiarioRequestDTO; // ✅ Importar DTO
import org.springframework.beans.factory.annotation.Autowired;
import com.calmamente.backend.model.TipoDiario;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DiarioService {

    @Autowired
    private DiarioRepository repository;
    
    @Autowired // ✅ Injetar o repositório de usuários
    private UsuarioRepository usuarioRepository; 

    // ✅ O método agora recebe o DTO de requisição
    public Diario criarEntrada(DiarioRequestDTO dto) {
        
        // 1. Buscando o Usuário (Ação que faltava)
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + dto.getUsuarioId()));
            
        // 2. Criando a Entidade Diario
        Diario novoDiario = new Diario();
        novoDiario.setConteudo(dto.getConteudo());
        // novoDiario.setTipo(dto.getTipo() != null ? TipoDiario.valueOf(dto.getTipo().toUpperCase()) : TipoDiario.TEXTO); // Exemplo de conversão se TipoDiario for Enum
        novoDiario.setCompartilhado(dto.getCompartilhado());
        novoDiario.setHumorDetectado(dto.getHumorDetectado());
        
        // 3. Associando o Usuário (Resolve o erro NOT NULL)
        novoDiario.setUsuario(usuario); 
        
        // 4. Salvando no repositório
        return repository.save(novoDiario);
    }
    
    public List<Diario> listarPorUsuario(UUID usuarioId) {
        return repository.findByUsuarioId(usuarioId);
    }

    public void deletarEntrada(UUID diarioId) {
        // Usa o método deleteById do JpaRepository
        repository.deleteById(diarioId); 
    }
}