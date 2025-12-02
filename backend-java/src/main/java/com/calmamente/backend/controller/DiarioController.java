package com.calmamente.backend.controller;

import com.calmamente.backend.dto.DiarioRequestDTO;
import com.calmamente.backend.model.Diario;
import com.calmamente.backend.service.DiarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/diario")
public class DiarioController {

    @Autowired
    private DiarioService diarioService;

    @PostMapping
    public ResponseEntity<Diario> criar(@RequestBody DiarioRequestDTO diarioRequest) {
        Diario novoDiario = diarioService.criarEntrada(diarioRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoDiario);
    }
    
    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<Diario>> listarDoUsuario(@PathVariable UUID id) {
        return ResponseEntity.ok(diarioService.listarPorUsuario(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        diarioService.deletarEntrada(id);
        // Retorna 204 No Content, indicando sucesso na exclusão
        return ResponseEntity.noContent().build(); 
    }
}