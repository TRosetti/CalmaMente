package com.calmamente.backend.dto;

import java.util.UUID;
import lombok.Data;

@Data
public class DiarioRequestDTO {
    // Conteúdo é enviado como JSON String
    private String conteudo;
    
    // Outros campos obrigatórios
    // private String tipo;
    private Boolean compartilhado;
    private String humorDetectado;
    
    // ✅ CHAVE: O ID do usuário enviado do Frontend
    private UUID usuarioId; 
}