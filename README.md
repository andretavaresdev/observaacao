# ObservAção

Sistema de gestão de solicitações e denúncias de cidadãos para prefeituras municipais. Permite que cidadãos registrem problemas urbanos (iluminação, buracos, lixo etc.) e que equipes de atendimento, gestão e TI acompanhem e resolvam essas demandas.

## Tecnologias

- **Backend:** Java 24 + Spring Boot 3.4.1 + Spring Data JPA + Bean Validation
- **Banco de dados:** H2 (in-memory)
- **Frontend:** HTML, CSS e JavaScript puro (sem framework)

## Como rodar

### Pré-requisitos

- Java 24+
- Maven 3.6+

### Iniciando a aplicação

```bash
mvn spring-boot:run
```

Acesse em **http://localhost:8080**. O frontend é servido diretamente pelo Spring Boot a partir de `src/main/resources/static/`.

O banco H2 console está disponível em **http://localhost:8080/h2-console**  
(JDBC URL: `jdbc:h2:mem:observaacao`, usuário: `sa`, senha: vazia)

## Perfis de usuário

| Perfil | Descrição |
|---|---|
| **Cidadão** | Visualiza categorias e registra solicitações |
| **Denúncia** | Envia denúncias anônimas sem coleta de dados |
| **Atendente** | Registra atendimentos, busca protocolos e gerencia a fila |
| **Gestora** | Dashboard com indicadores, gráficos e relatórios |
| **TI/Admin** | Monitoramento do sistema, banco de dados e logs |

## API REST

Base URL: `http://localhost:8080/api`

### Solicitações

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/solicitacoes` | Criar nova solicitação |
| `GET` | `/solicitacoes` | Listar todas (filtros: `?status=` e `?categoria=`) |
| `GET` | `/solicitacoes/{id}` | Buscar por ID |
| `GET` | `/solicitacoes/protocolo/{protocolo}` | Buscar por protocolo |
| `PATCH` | `/solicitacoes/{protocolo}/status` | Atualizar status |

### Usuários

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/usuarios` | Criar usuário |
| `GET` | `/usuarios` | Listar todos (filtro: `?tipo=`) |
| `GET` | `/usuarios/{id}` | Buscar por ID |

### Categorias disponíveis

`ILUMINACAO`, `BURACO`, `LIXO`, `AGUA`, `ESGOTO`, `ARBORIZACAO`, `OUTRO`

### Status possíveis

`ABERTA`, `EM_ANALISE`, `EM_ANDAMENTO`, `CONCLUIDA`, `CANCELADA`

## Estrutura do projeto

```
src/main/java/com/observaacao/
├── config/          # CORS e carga inicial de dados
├── controller/      # Endpoints REST
├── dto/             # Objetos de requisição e resposta
├── model/           # Entidades JPA e enums
├── repository/      # Interfaces Spring Data
└── service/         # Regras de negócio

src/main/resources/
├── static/          # Frontend (HTML, CSS, JS, imagens)
└── application.properties
```
