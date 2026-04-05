package observaacao.models;

import java.util.ArrayList;

public class FilaAtendimento {

    private ArrayList<Solicitacao> fila;

    public FilaAtendimento() {
        this.fila = new ArrayList<Solicitacao>();
    }

    public void adicionar(Solicitacao solicitacao) {
        fila.add(solicitacao);
    }

    public ArrayList<Solicitacao> listar() {
        return fila;
    }

    public int tamanho() {
        return fila.size();
    }
}
