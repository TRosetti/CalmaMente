package com.calmamente.backend.controller;

import com.calmamente.backend.model.Agendamento;
import com.calmamente.backend.service.AgendamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;
import com.calmamente.backend.exception.RegraNegocioException;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;

@RestController
@RequestMapping("/agendamentos")
public class AgendamentoController {

    @Autowired
    private AgendamentoService service;

    @PostMapping
    public ResponseEntity<Agendamento> criar(@RequestBody Agendamento agendamento) {
        Agendamento novoAgendamento = service.criarAgendamento(agendamento);
        return new ResponseEntity<>(novoAgendamento, HttpStatus.CREATED);
    }

    @ExceptionHandler(RegraNegocioException.class)
    public ResponseEntity<String> handleRegraNegocioException(RegraNegocioException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @GetMapping("/ocupados/{medicoId}")
    public ResponseEntity<List<Agendamento>> listarHorariosOcupados(
            @PathVariable UUID medicoId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime inicio, 
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime fim) { 
        
        return ResponseEntity.ok(service.listarOcupados(medicoId, inicio, fim));
    }

    
    @GetMapping("/meus/{usuarioId}")
    public ResponseEntity<List<Agendamento>> listarMinhas(@PathVariable UUID usuarioId) {
        return ResponseEntity.ok(service.listarMinhasConsultas(usuarioId));
    }

    @DeleteMapping("/usuario/{usuarioId}")
    public ResponseEntity<Void> excluirPorUsuario(@PathVariable UUID usuarioId) {
        long removidos = service.excluirAgendamentosPorUsuario(usuarioId);
        if (removidos > 0) {
            return ResponseEntity.noContent().build();
        } else {
            
            
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelar(@PathVariable UUID id) {
        service.cancelarAgendamento(id);
        
        // Retorna 204 No Content (sucesso sem corpo de resposta)
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/disponiveis")
    public ResponseEntity<List<LocalTime>> getHorariosDisponiveis(
            @RequestParam UUID medicoId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        
        // Exemplo de chamada: /agendamentos/disponiveis?medicoId=...&data=2025-12-01
        return ResponseEntity.ok(service.listarHorariosDisponiveis(medicoId, data));
    }
}