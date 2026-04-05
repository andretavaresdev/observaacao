package observaacao.models;

import java.util.ArrayList;

public class Solicitacao {

    private String protocolo;
    private Usuario solicitante;
    private String categoria;
    private String descricao;
    private String bairro;
    private String status;
    private ArrayList<HistoricoStatus> historico;

    public Solicitacao(String protocolo, Usuario solicitante, String categoria, String descricao, String bairro) {
        this.protocolo = protocolo;
        this.solicitante = solicitante;
        this.categoria = categoria;
        this.descricao = descricao;
        this.bairro = bairro;
        this.status = "Aberto";
        this.historico = new ArrayList<HistoricoStatus>();
    }

    public String getProtocolo(){
        return protocolo;
    }

    public Usuario getSolicitante(){
        return solicitante;
    }

    public String getCategoria(){
        return categoria;
    }

    public String getDescricao(){
        return descricao;
    }

    public String getBairro(){
        return bairro;
    }

    public String getStatus(){
        return status;
    }

    public ArrayList<HistoricoStatus> getHistorico(){
        return historico;
    }

    public void adicionarHistorico(String novoStatus, String comentario, String responsavel) {
        this.status = novoStatus;
        historico.add(new HistoricoStatus(novoStatus, comentario, responsavel));
    }

    public void exibir() {
        System.out.println("--------------------------------------------------");
        System.out.println("Protocolo: " + protocolo);
        System.out.println("Solicitante: " + solicitante.getNome());
        System.out.println("Categoria: " + categoria);
        System.out.println("Bairro: " + bairro);
        System.out.println("Status: " + status);
        System.out.println("Descricao: " + descricao);

        if (historico.size() > 0) {
            System.out.println("Historico:");
            for (int i = 0; i < historico.size(); i++) {
                historico.get(i).exibir();
            }
        }
        System.out.println("--------------------------------------------------");
    }
}
