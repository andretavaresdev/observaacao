package observaacao.menu;

import observaacao.services.ServicoSolicitacoes;
import java.util.Scanner;

public class MenuServidor {

    private ServicoSolicitacoes servico;
    private Scanner scanner;

    public MenuServidor(ServicoSolicitacoes servico, Scanner scanner) {
        this.servico = servico;
        this.scanner = scanner;
    }

    public void exibir() {
        int opcao = 0;
        while (opcao != 5) {
            System.out.println("\n===== PAINEL DO SERVIDOR =====");
            System.out.println("Total de solicitacoes: " + servico.totalCadastradas());
            System.out.println("1. Listar todas");
            System.out.println("2. Filtrar por bairro");
            System.out.println("3. Filtrar por categoria");
            System.out.println("4. Atualizar status");
            System.out.println("5. Voltar");
            System.out.print("Escolha: ");
            opcao = scanner.nextInt();
            scanner.nextLine();

            if (opcao == 1) {
                servico.listarTodas();
            } else if (opcao == 2) {
                filtrarBairro();
            } else if (opcao == 3) {
                filtrarCategoria();
            } else if (opcao == 4) {
                atualizarStatus();
            }
        }
    }

    private void filtrarBairro() {
        System.out.print("Nome do bairro: ");
        String bairro = scanner.nextLine();
        servico.listarPorBairro(bairro);
    }

    private void filtrarCategoria() {
        System.out.print("Categoria: ");
        String categoria = scanner.nextLine();
        servico.listarPorCategoria(categoria);
    }

    private void atualizarStatus() {
        System.out.print("Protocolo da solicitacao: ");
        String protocolo = scanner.nextLine();

        System.out.println("Novo status:");
        System.out.println("1. Em Atendimento");
        System.out.println("2. Resolvido");
        System.out.println("3. Encerrado");
        System.out.print("Escolha: ");
        int op = scanner.nextInt();
        scanner.nextLine();

        String novoStatus = "";
        if (op == 1) novoStatus = "Em Atendimento";
        else if (op == 2) novoStatus = "Resolvido";
        else if (op == 3) novoStatus = "Encerrado";

        System.out.print("Seu nome (responsavel): ");
        String responsavel = scanner.nextLine();

        System.out.print("Comentario: ");
        String comentario = scanner.nextLine();

        boolean ok = servico.atualizarStatus(protocolo, novoStatus, comentario, responsavel);
        if (ok) {
            System.out.println("Status atualizado com sucesso!");
        } else {
            System.out.println("Protocolo nao encontrado.");
        }
    }
}
