package observaacao.models;

public class HistoricoStatus {

    private String status;
    private String comentario;
    private String responsavel;

    public HistoricoStatus(String status, String comentario, String responsavel) {
        this.status = status;
        this.comentario = comentario;
        this.responsavel = responsavel;
    }

    public String getStatus(){
        return status;
    }

    public String getComentario(){
        return comentario;
    }

    public String getResponsavel(){
        return responsavel;
    }

    public void exibir() {
        System.out.println("  Status: " + status + " | Responsavel: " + responsavel + " | Comentario: " + comentario);
    }
}
