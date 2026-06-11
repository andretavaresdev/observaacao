package com.observaacao.dto;

import com.observaacao.model.Categoria;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SolicitacaoRequest(

        @NotBlank(message = "Descrição é obrigatória")
        String descricao,

        @NotNull(message = "Categoria é obrigatória")
        Categoria categoria,

        @NotBlank(message = "Endereço é obrigatório")
        String endereco,

        Long usuarioId,

        boolean anonimo
) {}
