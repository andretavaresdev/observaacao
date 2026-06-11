package com.observaacao.service;

import com.observaacao.repository.SolicitacaoRepository;
import org.springframework.stereotype.Service;

@Service
public class ProtocoloService {

    private final SolicitacaoRepository solicitacaoRepository;

    public ProtocoloService(SolicitacaoRepository solicitacaoRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
    }

    public String gerar() {
        long total = solicitacaoRepository.count();
        String candidato;
        long contador = total + 1;

        do {
            candidato = String.format("OBS-%03d", contador);
            contador++;
        } while (solicitacaoRepository.existsByProtocolo(candidato));

        return candidato;
    }
}
