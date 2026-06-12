package com.observaacao.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String tipo; // CIDADAO ou SERVIDOR

    @Column(nullable = false)
    private boolean anonimo;

    @Column(unique = true)
    private String login;

    @Column
    private String senha;

    protected Usuario() {}

    public Usuario(String nome, String tipo, boolean anonimo) {
        this.nome = nome;
        this.tipo = tipo;
        this.anonimo = anonimo;
    }

    public Usuario(String nome, String tipo, boolean anonimo, String login, String senha) {
        this.nome = nome;
        this.tipo = tipo;
        this.anonimo = anonimo;
        this.login = login;
        this.senha = senha;
    }

    public Long getId() { return id; }
    public String getNome() { return anonimo ? "Anônimo" : nome; }
    public String getNomeReal() { return nome; }
    public String getTipo() { return tipo; }
    public boolean isAnonimo() { return anonimo; }
    public String getLogin() { return login; }
    public String getSenha() { return senha; }

    public void setNome(String nome) { this.nome = nome; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public void setAnonimo(boolean anonimo) { this.anonimo = anonimo; }
    public void setLogin(String login) { this.login = login; }
    public void setSenha(String senha) { this.senha = senha; }
}
