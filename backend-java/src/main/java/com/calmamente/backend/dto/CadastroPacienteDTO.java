package com.calmamente.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CadastroPacienteDTO {
    private String email;
    private String password;
    private String nome;
    private String telefone;
    private String cpf;
    private LocalDate dataNascimento;
    private String genero;
}