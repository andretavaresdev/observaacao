package observaacao.models;

public class Usuario {

    private String nome;
    private String tipo;
    private boolean anonimo;

    public Usuario(String nome, String tipo, boolean anonimo) {
        this.nome = nome;
        this.tipo = tipo;
        this.anonimo = anonimo;
    }

    public String getNome(){
        return anonimo ? "Anonimo" : nome;
    }

    public String getTipo(){
        return tipo;
    }

    public boolean isAnonimo(){
        return anonimo;
    }
}
