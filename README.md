# ObservaAção

## Estrutura do projeto

```
src/
└── observaacao/
    ├── Main.java
    ├── models/
    │   ├── Categoria.java
    │   ├── FilaAtendimento.java
    │   ├── HistoricoStatus.java
    │   ├── Solicitacao.java
    │   └── Usuario.java
    ├── services/
    │   └── ServicoSolicitacoes.java
    └── menu/
        ├── MenuCidadao.java
        └── MenuServidor.java
```

---

## O que o sistema faz

- Cidadão pode registrar uma solicitacao (identificado ou anonimo)
- Cidadão recebe um protocolo (ex: OS-001) para acompanhar
- Servidor pode listar todas, filtrar por bairro ou categoria
- Servidor pode atualizar o status com comentario e nome do responsavel
- Cada solicitacao guarda o historico completo de atualizacoes de status

---