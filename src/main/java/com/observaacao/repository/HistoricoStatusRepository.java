package com.observaacao.repository;

import com.observaacao.model.HistoricoStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoricoStatusRepository extends JpaRepository<HistoricoStatus, Long> {

    List<HistoricoStatus> findBySolicitacaoIdOrderByDataAlteracaoAsc(Long solicitacaoId);
}
