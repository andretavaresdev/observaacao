package com.observaacao.controller;

import com.observaacao.dto.AtualizarStatusRequest;
import com.observaacao.dto.SolicitacaoRequest;
import com.observaacao.dto.SolicitacaoResponse;
import com.observaacao.model.Categoria;
import com.observaacao.model.StatusSolicitacao;
import com.observaacao.service.SolicitacaoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes")
public class SolicitacaoController {

    private final SolicitacaoService solicitacaoService;

    public SolicitacaoController(SolicitacaoService solicitacaoService) {
        this.solicitacaoService = solicitacaoService;
    }

    @PostMapping
    public ResponseEntity<SolicitacaoResponse> criar(@Valid @RequestBody SolicitacaoRequest request) {
        SolicitacaoResponse resposta = solicitacaoService.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }

    @GetMapping
    public ResponseEntity<List<SolicitacaoResponse>> listar(
            @RequestParam(required = false) StatusSolicitacao status,
            @RequestParam(required = false) Categoria categoria
    ) {
        List<SolicitacaoResponse> resultado = resolverFiltro(status, categoria);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(solicitacaoService.buscarPorId(id));
    }

    @GetMapping("/protocolo/{protocolo}")
    public ResponseEntity<SolicitacaoResponse> buscarPorProtocolo(@PathVariable String protocolo) {
        return ResponseEntity.ok(solicitacaoService.buscarPorProtocolo(protocolo));
    }

    @PatchMapping("/{protocolo}/status")
    public ResponseEntity<SolicitacaoResponse> atualizarStatus(
            @PathVariable String protocolo,
            @Valid @RequestBody AtualizarStatusRequest request
    ) {
        return ResponseEntity.ok(solicitacaoService.atualizarStatus(protocolo, request));
    }

    private List<SolicitacaoResponse> resolverFiltro(StatusSolicitacao status, Categoria categoria) {
        if (status != null && categoria != null) {
            return solicitacaoService.filtrarPorStatusECategoria(status, categoria);
        }
        if (status != null) {
            return solicitacaoService.filtrarPorStatus(status);
        }
        if (categoria != null) {
            return solicitacaoService.filtrarPorCategoria(categoria);
        }
        return solicitacaoService.listarTodas();
    }
}
