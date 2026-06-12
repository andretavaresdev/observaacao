package com.observaacao.dto;

import com.observaacao.model.Usuario;

public record UsuarioResponse(
        Long id,
        String nome,
        String tipo,
        boolean anonimo,
        String login
) {
    public static UsuarioResponse de(Usuario u) {
        return new UsuarioResponse(u.getId(), u.getNome(), u.getTipo(), u.isAnonimo(), u.getLogin());
    }
}
