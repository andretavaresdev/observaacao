package com.observaacao.dto;

import com.observaacao.model.HistoricoStatus;
import com.observaacao.model.StatusSolicitacao;

import java.time.LocalDateTime;

public record HistoricoStatusResponse(
        Long id,
        StatusSolicitacao status,
        String statusDescricao,
        String comentario,
        String responsavel,
        LocalDateTime dataAlteracao
) {
    public static HistoricoStatusResponse de(HistoricoStatus h) {
        return new HistoricoStatusResponse(
                h.getId(),
                h.getStatus(),
                h.getStatus().getDescricao(),
                h.getComentario(),
                h.getResponsavel(),
                h.getDataAlteracao()
        );
    }
}
