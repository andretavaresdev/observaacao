package com.observaacao.dto;

import com.observaacao.model.StatusSolicitacao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AtualizarStatusRequest(

        @NotNull(message = "Novo status é obrigatório")
        StatusSolicitacao novoStatus,

        String comentario,

        @NotBlank(message = "Responsável é obrigatório")
        String responsavel
) {}
