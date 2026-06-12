package com.observaacao.config;

import com.observaacao.dto.AtualizarStatusRequest;
import com.observaacao.dto.SolicitacaoRequest;
import com.observaacao.dto.UsuarioRequest;
import com.observaacao.model.Categoria;
import com.observaacao.model.StatusSolicitacao;
import com.observaacao.service.SolicitacaoService;
import com.observaacao.service.UsuarioService;
import com.observaacao.dto.UsuarioResponse;
import com.observaacao.dto.SolicitacaoResponse;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class DataLoader {

    private final UsuarioService usuarioService;
    private final SolicitacaoService solicitacaoService;

    public DataLoader(UsuarioService usuarioService, SolicitacaoService solicitacaoService) {
        this.usuarioService = usuarioService;
        this.solicitacaoService = solicitacaoService;
    }

    @PostConstruct
    public void carregarDados() {
        UsuarioResponse joao = usuarioService.criar(new UsuarioRequest("João Miguel", "CIDADAO", false, "cidadao", "123"));
        UsuarioResponse maria = usuarioService.criar(new UsuarioRequest("Maria Clara", "CIDADAO", false, null, null));
        usuarioService.criar(new UsuarioRequest("Carlos Andrade", "SERVIDOR", false, "atendente", "123"));

        SolicitacaoResponse s1 = solicitacaoService.criar(new SolicitacaoRequest(
                "Poste apagado na Rua Genny Gomes há 3 semanas",
                Categoria.ILUMINACAO,
                "Rua Genny Gomes, 700 — Itaipava",
                joao.id(),
                false
        ));

        SolicitacaoResponse s2 = solicitacaoService.criar(new SolicitacaoRequest(
                "Buraco no asfalto na Rua Alarico Cunha 1840 causando acidentes",
                Categoria.BURACO,
                "Rua Alarico Cunha 1840",
                maria.id(),
                false
        ));

        solicitacaoService.criar(new SolicitacaoRequest(
                "Lixo acumulado na calçada sem coleta há 5 dias",
                Categoria.LIXO,
                "Quadra QN 829 Conjunto 1, 477 — Samambaia Norte (Samambaia)",
                null,
                true
        ));

        solicitacaoService.atualizarStatus(s2.protocolo(), new AtualizarStatusRequest(
                StatusSolicitacao.EM_ANALISE,
                "Equipe de vistoria será deslocada amanhã",
                "Carlos Andrade"
        ));
    }
}
