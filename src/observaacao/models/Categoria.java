package observaacao.models;

public class Categoria {

    public static final String ILUMINACAO = "Iluminacao";
    public static final String BURACO = "Buraco";
    public static final String LIMPEZA = "Limpeza";
    public static final String SAUDE = "Saude";
    public static final String SEGURANCA = "Seguranca Escolar";
    public static final String DENUNCIA = "Denuncia";
    public static final String OUTRO = "Outro";

    public static String[] listar() {
        return new String[]{ILUMINACAO, BURACO, LIMPEZA, SAUDE, SEGURANCA, DENUNCIA, OUTRO};
    }
}
