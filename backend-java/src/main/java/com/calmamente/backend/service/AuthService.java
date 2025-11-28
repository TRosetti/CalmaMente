package com.calmamente.backend.service;

import com.calmamente.backend.client.SupabaseAuthClient;
import com.calmamente.backend.dto.CadastroMedicoDTO;
import com.calmamente.backend.dto.CadastroPacienteDTO;
import com.calmamente.backend.model.Medico;
import com.calmamente.backend.model.TipoUsuario;
import com.calmamente.backend.model.Usuario;
import com.calmamente.backend.repository.MedicoRepository;
import com.calmamente.backend.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private SupabaseAuthClient supabaseClient;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Transactional
    public Usuario registrarPaciente(CadastroPacienteDTO dto) {
        // 1. Cria no Auth (Trigger cria linha no public.usuario)
        UUID userId = supabaseClient.criarUsuario(
            dto.getEmail(), 
            dto.getPassword(), 
            dto.getNome(), 
            "paciente"
        );

        // 2. RECUPERA o usuário que o Trigger acabou de criar
        // Isso garante que estamos mexendo na versão mais atual do banco
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Erro de sincronia: Usuário não encontrado após criação no Auth."));

        // 3. Atualiza os dados
        usuario.setTelefone(dto.getTelefone());
        usuario.setCpf(dto.getCpf());
        usuario.setDataNascimento(dto.getDataNascimento());
        usuario.setGenero(dto.getGenero());
        usuario.setAtivo(true);
        // Nome e Tipo já vieram certos via metadados no passo 1, mas reforçamos:
        usuario.setNome(dto.getNome());
        
        return usuarioRepository.save(usuario);
    }

    @Transactional
    public Medico registrarMedico(CadastroMedicoDTO dto) {
        // 1. Cria no Auth
        UUID userId = supabaseClient.criarUsuario(
            dto.getEmail(), 
            dto.getPassword(), 
            dto.getNome(), 
            "profissional"
        );

        // 2. RECUPERA e ATUALIZA o usuário (Isso já estava funcionando)
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Erro de sincronia: Usuário não encontrado."));

        usuario.setTelefone(dto.getTelefone());
        usuario.setCpf(dto.getCpf());
        usuario.setDataNascimento(dto.getDataNascimento());
        usuario.setGenero(dto.getGenero());
        usuario.setAtivo(true);
        usuario.setNome(dto.getNome());
        
        // Salva e força o banco a sincronizar agora
        usuarioRepository.saveAndFlush(usuario);

        // 3. Lida com a tabela Médico
        Medico medico = medicoRepository.findById(userId).orElse(null);

        if (medico == null) {
            medico = new Medico();
            // NÃO setamos setId(userId) manualmente, o setUsuario cuida disso via @MapsId
            medico.setUsuario(usuario); 
            medico.setCriadoEm(LocalDateTime.now());
            
            // A LINHA MÁGICA: Forçamos o Hibernate a entender que é INSERT
            medico.setNew(true); 
        }
        
        // Atualiza os dados
        medico.setUsuario(usuario); // Reforça vínculo
        medico.setCrm(dto.getCrm());
        medico.setCnpj(dto.getCnpj());
        medico.setEspecialidade(dto.getEspecialidade());

        return medicoRepository.save(medico);
    }
}