package observaacao;

import observaacao.services.ServicoSolicitacoes;
import observaacao.menu.MenuCidadao;
import observaacao.menu.MenuServidor;
import java.util.Scanner;

public class Main {

    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);
        ServicoSolicitacoes servico = new ServicoSolicitacoes();

        System.out.println("====================================");
        System.out.println("           ObservaAcao              ");
        System.out.println("====================================");

        int opcao = 0;
        while (opcao != 3) {
            System.out.println("\nVoce e:");
            System.out.println("1. Cidadao");
            System.out.println("2. Servidor / Gestor");
            System.out.println("3. Sair");
            System.out.print("Escolha: ");
            opcao = scanner.nextInt();
            scanner.nextLine();

            if (opcao == 1) {
                MenuCidadao menuCidadao = new MenuCidadao(servico, scanner);
                menuCidadao.exibir();
            } else if (opcao == 2) {
                MenuServidor menuServidor = new MenuServidor(servico, scanner);
                menuServidor.exibir();
            }
        }

        System.out.println("\nAte mais!");
        scanner.close();
    }
}
