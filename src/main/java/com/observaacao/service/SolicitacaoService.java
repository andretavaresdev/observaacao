package com.observaacao.service;

import com.observaacao.dto.AtualizarStatusRequest;
import com.observaacao.dto.SolicitacaoRequest;
import com.observaacao.dto.SolicitacaoResponse;
import com.observaacao.model.*;
import com.observaacao.repository.SolicitacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
public class SolicitacaoService {

    private final SolicitacaoRepository solicitacaoRepository;
    private final UsuarioService usuarioService;
    private final ProtocoloService protocoloService;

    public SolicitacaoService(
            SolicitacaoRepository solicitacaoRepository,
            UsuarioService usuarioService,
            ProtocoloService protocoloService
    ) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.usuarioService = usuarioService;
        this.protocoloService = protocoloService;
    }

    public SolicitacaoResponse criar(SolicitacaoRequest request) {
        Usuario usuario = resolverUsuario(request);
        String protocolo = protocoloService.gerar();
        Solicitacao solicitacao = new Solicitacao(
                protocolo,
                request.descricao(),
                request.categoria(),
                request.endereco(),
                usuario
        );

        HistoricoStatus entrada = new HistoricoStatus(
                StatusSolicitacao.ABERTA,
                "Solicitação registrada",
                usuario != null ? usuario.getNomeReal() : "Sistema",
                solicitacao
        );
        solicitacao.adicionarHistorico(entrada);

        return SolicitacaoResponse.de(solicitacaoRepository.save(solicitacao));
    }

    @Transactional(readOnly = true)
    public SolicitacaoResponse buscarPorProtocolo(String protocolo) {
        return solicitacaoRepository.findByProtocolo(protocolo)
                .map(SolicitacaoResponse::de)
                .orElseThrow(() -> new NoSuchElementException("Protocolo não encontrado: " + protocolo));
    }

    @Transactional(readOnly = true)
    public SolicitacaoResponse buscarPorId(Long id) {
        return solicitacaoRepository.findById(id)
                .map(SolicitacaoResponse::de)
                .orElseThrow(() -> new NoSuchElementException("Solicitação não encontrada: " + id));
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoResponse> listarTodas() {
        return solicitacaoRepository.findAll().stream()
                .map(SolicitacaoResponse::de)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoResponse> filtrarPorStatus(StatusSolicitacao status) {
        return solicitacaoRepository.findByStatus(status).stream()
                .map(SolicitacaoResponse::de)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoResponse> filtrarPorCategoria(Categoria categoria) {
        return solicitacaoRepository.findByCategoria(categoria).stream()
                .map(SolicitacaoResponse::de)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoResponse> filtrarPorStatusECategoria(StatusSolicitacao status, Categoria categoria) {
        return solicitacaoRepository.findByStatusAndCategoria(status, categoria).stream()
                .map(SolicitacaoResponse::de)
                .toList();
    }

    public SolicitacaoResponse atualizarStatus(String protocolo, AtualizarStatusRequest request) {
        Solicitacao solicitacao = solicitacaoRepository.findByProtocolo(protocolo)
                .orElseThrow(() -> new NoSuchElementException("Protocolo não encontrado: " + protocolo));

        validarTransicaoStatus(solicitacao.getStatus(), request.novoStatus());

        HistoricoStatus entrada = new HistoricoStatus(
                request.novoStatus(),
                request.comentario(),
                request.responsavel(),
                solicitacao
        );
        solicitacao.adicionarHistorico(entrada);

        return SolicitacaoResponse.de(solicitacaoRepository.save(solicitacao));
    }

    private void validarTransicaoStatus(StatusSolicitacao atual, StatusSolicitacao novo) {
        if (atual == StatusSolicitacao.CONCLUIDA || atual == StatusSolicitacao.CANCELADA) {
            throw new IllegalStateException(
                    "Solicitação com status '" + atual.getDescricao() + "' não pode ser alterada."
            );
        }
        if (atual == novo) {
            throw new IllegalArgumentException("A solicitação já está com status: " + novo.getDescricao());
        }
    }

    private Usuario resolverUsuario(SolicitacaoRequest request) {
        if (request.usuarioId() == null) return null;
        return usuarioService.buscarEntidade(request.usuarioId());
    }
}
