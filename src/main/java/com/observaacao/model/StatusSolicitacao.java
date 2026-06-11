package com.observaacao.model;

public enum StatusSolicitacao {
    ABERTA("Aberta"),
    EM_ANALISE("Em Análise"),
    EM_ANDAMENTO("Em Andamento"),
    CONCLUIDA("Concluída"),
    CANCELADA("Cancelada");

    private final String descricao;

    StatusSolicitacao(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
