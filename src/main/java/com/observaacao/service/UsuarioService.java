package com.observaacao.service;

import com.observaacao.dto.UsuarioRequest;
import com.observaacao.dto.UsuarioResponse;
import com.observaacao.model.Usuario;
import com.observaacao.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public UsuarioResponse criar(UsuarioRequest request) {
        validarTipo(request.tipo());
        Usuario usuario = new Usuario(request.nome(), request.tipo().toUpperCase(), request.anonimo(), request.login(), request.senha());
        return UsuarioResponse.de(usuarioRepository.save(usuario));
    }

    @Transactional(readOnly = true)
    public UsuarioResponse autenticar(String login, String senha) {
        return usuarioRepository.findByLoginAndSenha(login, senha)
                .map(UsuarioResponse::de)
                .orElseThrow(() -> new IllegalArgumentException("Usuário ou senha incorretos"));
    }

    @Transactional(readOnly = true)
    public UsuarioResponse buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .map(UsuarioResponse::de)
                .orElseThrow(() -> new NoSuchElementException("Usuário não encontrado: " + id));
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(UsuarioResponse::de)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listarPorTipo(String tipo) {
        validarTipo(tipo);
        return usuarioRepository.findByTipo(tipo.toUpperCase()).stream()
                .map(UsuarioResponse::de)
                .toList();
    }

    Usuario buscarEntidade(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Usuário não encontrado: " + id));
    }

    private void validarTipo(String tipo) {
        if (!tipo.equalsIgnoreCase("CIDADAO") && !tipo.equalsIgnoreCase("SERVIDOR")) {
            throw new IllegalArgumentException("Tipo inválido. Use CIDADAO ou SERVIDOR.");
        }
    }
}
