package observaacao.services;

import observaacao.models.FilaAtendimento;
import observaacao.models.Solicitacao;
import observaacao.models.Usuario;

public class ServicoSolicitacoes {

    private FilaAtendimento fila;
    private int contadorProtocolo;

    public ServicoSolicitacoes() {
        this.fila = new FilaAtendimento();
        this.contadorProtocolo = 1;
    }

    private String gerarProtocolo() {
        String numero = String.format("%03d", contadorProtocolo);
        contadorProtocolo++;
        return "OS-" + numero;
    }

    public String cadastrar(String nomeUsuario, boolean anonimo, String categoria, String descricao, String bairro) {
        String protocolo = gerarProtocolo();
        Usuario usuario = new Usuario(nomeUsuario, "Cidadao", anonimo);
        Solicitacao s = new Solicitacao(protocolo, usuario, categoria, descricao, bairro);
        fila.adicionar(s);
        return protocolo;
    }

    public Solicitacao buscarPorProtocolo(String protocolo) {
        for (int i = 0; i < fila.listar().size(); i++) {
            if (fila.listar().get(i).getProtocolo().equals(protocolo)) {
                return fila.listar().get(i);
            }
        }
        return null;
    }

    public void listarTodas() {
        if (fila.tamanho() == 0) {
            System.out.println("Nenhuma solicitacao cadastrada.");
            return;
        }
        for (int i = 0; i < fila.listar().size(); i++) {
            fila.listar().get(i).exibir();
        }
    }

    public void listarPorBairro(String bairro) {
        boolean encontrou = false;
        for (int i = 0; i < fila.listar().size(); i++) {
            if (fila.listar().get(i).getBairro().equalsIgnoreCase(bairro)) {
                fila.listar().get(i).exibir();
                encontrou = true;
            }
        }
        if (!encontrou) {
            System.out.println("Nenhuma solicitacao encontrada para o bairro: " + bairro);
        }
    }

    public void listarPorCategoria(String categoria) {
        boolean encontrou = false;
        for (int i = 0; i < fila.listar().size(); i++) {
            if (fila.listar().get(i).getCategoria().equalsIgnoreCase(categoria)) {
                fila.listar().get(i).exibir();
                encontrou = true;
            }
        }
        if (!encontrou) {
            System.out.println("Nenhuma solicitacao encontrada para a categoria: " + categoria);
        }
    }

    public boolean atualizarStatus(String protocolo, String novoStatus, String comentario, String responsavel) {
        Solicitacao s = buscarPorProtocolo(protocolo);
        if (s != null) {
            s.adicionarHistorico(novoStatus, comentario, responsavel);
            return true;
        }
        return false;
    }

    public int totalCadastradas() {
        return fila.tamanho();
    }
}
