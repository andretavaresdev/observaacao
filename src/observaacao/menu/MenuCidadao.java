package observaacao.menu;

import observaacao.models.Categoria;
import observaacao.models.Solicitacao;
import observaacao.services.ServicoSolicitacoes;
import java.util.Scanner;

public class MenuCidadao {

    private ServicoSolicitacoes servico;
    private Scanner scanner;

    public MenuCidadao(ServicoSolicitacoes servico, Scanner scanner) {
        this.servico = servico;
        this.scanner = scanner;
    }

    public void exibir() {
        int opcao = 0;
        while (opcao != 3) {
            System.out.println("\n===== MENU CIDADAO =====");
            System.out.println("1. Registrar solicitacao");
            System.out.println("2. Consultar por protocolo");
            System.out.println("3. Voltar");
            System.out.print("Escolha: ");
            opcao = scanner.nextInt();
            scanner.nextLine();

            if (opcao == 1) {
                registrar();
            } else if (opcao == 2) {
                consultar();
            }
        }
    }

    private void registrar() {
        System.out.println("\n--- Nova Solicitacao ---");

        System.out.print("Deseja se identificar? (s/n): ");
        String resposta = scanner.nextLine();
        boolean anonimo = resposta.equalsIgnoreCase("n");

        String nome = "";
        if (!anonimo) {
            System.out.print("Seu nome: ");
            nome = scanner.nextLine();
        } else {
            System.out.println("Ok! Sua solicitacao sera registrada como anonima.");
        }

        System.out.println("\nCategorias disponiveis:");
        String[] categorias = Categoria.listar();
        for (int i = 0; i < categorias.length; i++) {
            System.out.println((i + 1) + ". " + categorias[i]);
        }
        System.out.print("Escolha o numero da categoria: ");
        int catEscolhida = scanner.nextInt();
        scanner.nextLine();
        String categoria = categorias[catEscolhida - 1];

        System.out.print("Bairro: ");
        String bairro = scanner.nextLine();

        System.out.print("Descricao do problema: ");
        String descricao = scanner.nextLine();

        String protocolo = servico.cadastrar(nome, anonimo, categoria, descricao, bairro);

        System.out.println("\nSolicitacao registrada com sucesso!");
        System.out.println("Seu protocolo: " + protocolo);
        System.out.println("Guarde este numero para acompanhar sua solicitacao.");
    }

    private void consultar() {
        System.out.print("\nInforme o protocolo (ex: OS-001): ");
        String protocolo = scanner.nextLine();

        Solicitacao s = servico.buscarPorProtocolo(protocolo);
        if (s != null) {
            s.exibir();
        } else {
            System.out.println("Protocolo nao encontrado.");
        }
    }
}
