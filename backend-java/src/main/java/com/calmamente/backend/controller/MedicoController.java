package com.calmamente.backend.controller;

import com.calmamente.backend.model.Medico;
import com.calmamente.backend.service.MedicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medicos")
public class MedicoController {

    @Autowired
    private MedicoService service;

    @GetMapping
    public ResponseEntity<List<Medico>> listar(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String especialidade) {
        
        return ResponseEntity.ok(service.buscarMedicos(nome, especialidade));
    }
}