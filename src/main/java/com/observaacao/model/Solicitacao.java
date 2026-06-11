package com.observaacao.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "solicitacoes")
public class Solicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String protocolo;

    @NotBlank(message = "Descrição é obrigatória")
    @Column(nullable = false, length = 1000)
    private String descricao;

    @NotNull(message = "Categoria é obrigatória")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Categoria categoria;

    @Column(nullable = false)
    private String endereco;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusSolicitacao status;

    @Column(nullable = false)
    private LocalDateTime dataCriacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @OneToMany(mappedBy = "solicitacao", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("dataAlteracao ASC")
    private List<HistoricoStatus> historico = new ArrayList<>();

    protected Solicitacao() {}

    public Solicitacao(String protocolo, String descricao, Categoria categoria, String endereco, Usuario usuario) {
        this.protocolo = protocolo;
        this.descricao = descricao;
        this.categoria = categoria;
        this.endereco = endereco;
        this.usuario = usuario;
        this.status = StatusSolicitacao.ABERTA;
        this.dataCriacao = LocalDateTime.now();
    }

    public void adicionarHistorico(HistoricoStatus entrada) {
        this.historico.add(entrada);
        this.status = entrada.getStatus();
    }

    // Getters
    public Long getId() { return id; }
    public String getProtocolo() { return protocolo; }
    public String getDescricao() { return descricao; }
    public Categoria getCategoria() { return categoria; }
    public String getEndereco() { return endereco; }
    public StatusSolicitacao getStatus() { return status; }
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public Usuario getUsuario() { return usuario; }
    public List<HistoricoStatus> getHistorico() { return historico; }

    // Setters necessários para updates parciais
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public void setEndereco(String endereco) { this.endereco = endereco; }
    public void setStatus(StatusSolicitacao status) { this.status = status; }
}
