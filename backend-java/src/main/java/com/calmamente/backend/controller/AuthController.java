package com.calmamente.backend.controller;

import com.calmamente.backend.dto.CadastroMedicoDTO;
import com.calmamente.backend.dto.CadastroPacienteDTO;
import com.calmamente.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/registrar/paciente")
    public ResponseEntity<?> registrarPaciente(@RequestBody CadastroPacienteDTO dto) {
        var usuario = authService.registrarPaciente(dto);
        return ResponseEntity.ok(usuario);
    }

    @PostMapping("/registrar/medico")
    public ResponseEntity<?> registrarMedico(@RequestBody CadastroMedicoDTO dto) {
        var medico = authService.registrarMedico(dto);
        return ResponseEntity.ok(medico);
    }
}