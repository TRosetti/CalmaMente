package com.calmamente.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.domain.Persistable; // Import Novo

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@Table(name = "medico")
public class Medico implements Persistable<UUID> { // Implementa Persistable

    @Id
    private UUID id; 

    @OneToOne
    @MapsId 
    @JoinColumn(name = "id")
    private Usuario usuario;

    @Column(nullable = false, unique = true)
    private String crm;

    @Column(unique = true)
    private String cnpj;
    
    private String especialidade;

    @Column(name = "criado_em", updatable = false)
    private LocalDateTime criadoEm;

    // Campo auxiliar para o Hibernate saber se é novo
    @Transient // Não salva no banco
    private boolean isNew = false;

    @PrePersist
    protected void onCreate() {
        if (this.criadoEm == null) this.criadoEm = LocalDateTime.now();
    }

    // --- Métodos da Interface Persistable ---

    @Override
    public boolean isNew() {
        // Se isNew for true OU se criadoEm for null, considera novo
        return isNew || createdEmCheck();
    }

    private boolean createdEmCheck() {
       return this.criadoEm == null; 
    }

    public void setNew(boolean isNew) {
        this.isNew = isNew;
    }
}