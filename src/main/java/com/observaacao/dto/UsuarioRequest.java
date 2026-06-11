package com.observaacao.dto;

import com.observaacao.model.Usuario;
import jakarta.validation.constraints.NotBlank;

public record UsuarioRequest(
        @NotBlank(message = "Nome é obrigatório") String nome,
        @NotBlank(message = "Tipo é obrigatório") String tipo,
        boolean anonimo
) {}
