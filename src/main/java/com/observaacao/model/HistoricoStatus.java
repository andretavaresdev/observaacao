package com.observaacao.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "historico_status")
public class HistoricoStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusSolicitacao status;

    private String comentario;

    @Column(nullable = false)
    private String responsavel;

    @Column(nullable = false)
    private LocalDateTime dataAlteracao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "solicitacao_id", nullable = false)
    private Solicitacao solicitacao;

    protected HistoricoStatus() {}

    public HistoricoStatus(StatusSolicitacao status, String comentario, String responsavel, Solicitacao solicitacao) {
        this.status = status;
        this.comentario = comentario;
        this.responsavel = responsavel;
        this.solicitacao = solicitacao;
        this.dataAlteracao = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public StatusSolicitacao getStatus() { return status; }
    public String getComentario() { return comentario; }
    public String getResponsavel() { return responsavel; }
    public LocalDateTime getDataAlteracao() { return dataAlteracao; }
    public Solicitacao getSolicitacao() { return solicitacao; }
}
