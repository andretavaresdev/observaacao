package com.observaacao.repository;

import com.observaacao.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByNomeAndTipo(String nome, String tipo);

    Optional<Usuario> findByLoginAndSenha(String login, String senha);

    List<Usuario> findByTipo(String tipo);
}
