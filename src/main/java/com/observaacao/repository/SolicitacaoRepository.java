package com.observaacao.repository;

import com.observaacao.model.Categoria;
import com.observaacao.model.Solicitacao;
import com.observaacao.model.StatusSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    Optional<Solicitacao> findByProtocolo(String protocolo);

    List<Solicitacao> findByStatus(StatusSolicitacao status);

    List<Solicitacao> findByCategoria(Categoria categoria);

    List<Solicitacao> findByUsuarioId(Long usuarioId);

    @Query("SELECT s FROM Solicitacao s WHERE s.status = :status AND s.categoria = :categoria")
    List<Solicitacao> findByStatusAndCategoria(StatusSolicitacao status, Categoria categoria);

    boolean existsByProtocolo(String protocolo);
}
