package com.observaacao.dto;

import com.observaacao.model.Categoria;
import com.observaacao.model.Solicitacao;
import com.observaacao.model.StatusSolicitacao;

import java.time.LocalDateTime;
import java.util.List;

public record SolicitacaoResponse(
        Long id,
        String protocolo,
        String descricao,
        Categoria categoria,
        String categoriaDescricao,
        String endereco,
        StatusSolicitacao status,
        String statusDescricao,
        LocalDateTime dataCriacao,
        String nomeUsuario,
        List<HistoricoStatusResponse> historico
) {
    public static SolicitacaoResponse de(Solicitacao s) {
        List<HistoricoStatusResponse> hist = s.getHistorico().stream()
                .map(HistoricoStatusResponse::de)
                .toList();

        String nomeUsuario = s.getUsuario() != null ? s.getUsuario().getNome() : "Anônimo";

        return new SolicitacaoResponse(
                s.getId(),
                s.getProtocolo(),
                s.getDescricao(),
                s.getCategoria(),
                s.getCategoria().getDescricao(),
                s.getEndereco(),
                s.getStatus(),
                s.getStatus().getDescricao(),
                s.getDataCriacao(),
                nomeUsuario,
                hist
        );
    }
}
