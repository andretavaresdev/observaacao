package com.observaacao.model;

public enum Categoria {
    ILUMINACAO("Iluminação Pública"),
    BURACO("Buraco / Pavimentação"),
    LIXO("Coleta de Lixo"),
    AGUA("Abastecimento de Água"),
    ESGOTO("Esgoto"),
    ARBORIZACAO("Arborização"),
    OUTRO("Outro");

    private final String descricao;

    Categoria(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
