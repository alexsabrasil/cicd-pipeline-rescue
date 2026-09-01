# CI/CD Pipeline Rescue

Projeto desenvolvido como parte da formação em **DevOps da Formação Acelerada em Programação (FAP) - Aponti**.

O objetivo da atividade é propor uma esteira de CI/CD para solucionar o cenário fictício da empresa **TechExpress**, substituindo processos manuais de implantação por um fluxo automatizado, validado e seguro.

Além do desenho solicitado na atividade, foi criada uma implementação prática utilizando **Node.js, Jest, ESLint e Docker**, com o objetivo de aplicar os conceitos estudados e documentar o projeto para portfólio.

---

1. Cenário

A TechExpress realiza atualizações manualmente. Nesse processo, um desenvolvedor copia os arquivos, acessa o servidor de produção e executa os scripts manualmente.

Esse modelo resultou em problemas como:

- erros de sintaxe chegando à produção;
- indisponibilidade do sistema;
- falhas de segurança não identificadas;
- ausência de validações automatizadas;
- risco elevado durante as implantações.

A proposta é substituir esse processo por uma esteira CI/CD com validações progressivas.

---

2. Conceitos de CI/CD

### Continuous Integration - CI

Continuous Integration, ou Integração Contínua, é a prática de integrar alterações de código em um repositório compartilhado de forma frequente.

A cada integração, verificações automatizadas permitem identificar problemas rapidamente, reduzindo conflitos e evitando que código com falhas avance no processo.

### Continuous Delivery

Na Entrega Contínua, o software passa pelas validações automatizadas e permanece pronto para implantação em produção, mas a liberação depende de uma aprovação humana.

### Continuous Deployment

Na Implantação Contínua, depois que todas as validações são aprovadas, a aplicação pode ser implantada automaticamente em produção.

A principal diferença é:

- **Continuous Delivery:** existe aprovação humana antes da produção.
- **Continuous Deployment:** a implantação pode ocorrer automaticamente.

Neste projeto, o modelo adotado segue **Continuous Delivery**, pois existe aprovação manual antes do deploy em produção.

---

3. Arquitetura proposta

O pipeline foi organizado seguindo os princípios de Fail Fast, Quality Gate e validação antes da produção.

```text
Commit / Push
      |
      v
Build da Aplicação
      |
      v
Testes Unitários
      |
      v
Análise Estática de Código
      |
      v
Quality Gate - Cobertura >= 80%
      |
      v
Criação da Imagem Docker
      |
      v
Deploy em Homologação (Staging)
      |
      v
Testes E2E
      |
      v
Aprovação Manual do QA
      |
      v
Deploy em Produção
```

4. Regras do Pipeline

### Fail Fast

As validações iniciais devem interromper o pipeline rapidamente quando houver falhas.

Dessa forma, etapas mais demoradas não consomem recursos caso o código apresente problemas nas etapas iniciais.

### Quality Gate

Antes da criação da imagem Docker, o projeto deve atingir pelo menos **80% de cobertura de testes**.

Durante a execução local deste projeto foi obtida cobertura de **100%** em statements, branches, functions e lines, superando o mínimo estabelecido.

### Segurança na Entrega

A aplicação não deve seguir automaticamente para produção.

Depois do deploy em homologação e da execução dos testes E2E, é necessária uma etapa de **aprovação manual do QA** antes do deploy em produção.


---

5. Tecnologias Utilizadas

- Node.js
- Express
- Jest
- Supertest
- ESLint
- Docker
- Git
- GitHub
- GitHub Actions

---

6. Estrutura do Projeto

```text
cicd-pipeline-rescue/
├── .github/
│   └── workflows/
├── docs/
├── src/
│   ├── app.js
│   └── server.js
├── tests/
│   ├── app.test.js
│   └── e2e.test.js
├── .dockerignore
├── .gitignore
├── Dockerfile
├── eslint.config.js
├── jest.config.js
├── package.json
├── package-lock.json
└── README.md
```

7. API de Demonstração

Foi criada uma API mínima em Node.js com Express para representar o serviço da TechExpress.

### Endpoint de saúde

```text
GET /health

Resposta esperada:

{
  "status": "ok",
  "service": "TechExpress"
}

Esse endpoint é utilizado para verificar se a aplicação está disponível durante as etapas de validação.
```

8. Testes Unitários e Quality Gate

Os testes automatizados foram implementados utilizando **Jest** e **Supertest**.

Para executar:

npm test

Resultado obtido no laboratório:

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total

A cobertura obtida foi:

Statements : 100%
Branches   : 100%
Functions  : 100%
Lines      : 100%

O resultado supera o **Quality Gate mínimo de 80%** definido para o pipeline.

---

9. Análise Estática de Código

O ESLint foi configurado para analisar os arquivos presentes nos diretórios `src` e `tests`.

Execução:

npm run lint

Durante a validação local, a análise foi concluída sem erros.

---

10. Containerização com Docker

Após a aprovação das validações anteriores, a aplicação foi empacotada em uma imagem Docker.

Criação da imagem:

docker build -t techexpress-api:1.0 .

A imagem criada foi validada com:

docker images | grep techexpress

Resultado:

techexpress-api:1.0

A aplicação também foi executada em container para validar o funcionamento da imagem.

docker run -d --name techexpress-api -p 3000:3000 techexpress-api:1.0

O endpoint de saúde foi validado com:

curl http://localhost:3000/health

Resposta obtida:

{"status":"ok","service":"TechExpress"}

---

11. Deploy em Homologação

Para representar a etapa de homologação (Staging), foi utilizado um container Docker local executando a aplicação na porta 3001.

docker run -d \
  --name techexpress-staging \
  -p 3001:3000 \
  techexpress-api:1.0

A disponibilidade do ambiente foi validada com:

curl http://localhost:3001/health

Resposta obtida:

{"status":"ok","service":"TechExpress"}

> O ambiente de homologação utilizado neste laboratório é uma simulação local com Docker e não representa uma infraestrutura externa de staging ou produção.

---

12. Testes E2E

Após o deploy em homologação, foi executado um teste End-to-End contra a aplicação em funcionamento.

Comando:

npm run test:e2e

Resultado obtido:

PASS tests/e2e.test.js

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total

O teste E2E acessa a aplicação executada no ambiente de homologação e verifica o endpoint `/health`.

Essa validação ocorre antes da aprovação manual do QA e do possível deploy em produção.

---

13. Defesa da Arquitetura

### Build e validações antes da criação da imagem

O Build e as validações iniciais foram posicionados antes da criação da imagem Docker para aplicar o princípio de **Fail Fast**.

Caso o código apresente falhas nas etapas iniciais, o pipeline deve ser interrompido antes de consumir recursos com a criação de containers e com as etapas posteriores de implantação.

Além disso, os testes precisam atender ao Quality Gate de cobertura mínima de 80% antes do empacotamento da aplicação.

### Homologação e testes E2E antes da produção

O deploy em homologação foi posicionado antes dos testes E2E para permitir que esses testes validem a aplicação já em execução em um ambiente controlado.

Somente após a validação em homologação o fluxo deve chegar ao gatilho de aprovação manual do QA.

Essa aprovação funciona como uma barreira de segurança antes do deploy em produção.

---

14. Status do Projeto

Etapas implementadas e validadas:

- [x] Aplicação Node.js/Express
- [x] Endpoint de health check
- [x] Testes unitários
- [x] Quality Gate mínimo de 80%
- [x] Cobertura de testes obtida de 100%
- [x] Análise estática com ESLint
- [x] Criação da imagem Docker
- [x] Execução e validação do container
- [x] Simulação local de homologação
- [x] Testes E2E em homologação
- [x] Pipeline automatizado com GitHub Actions
- [ ] Gatilho de aprovação manual do QA
- [ ] Deploy em produção

As etapas ainda não marcadas fazem parte da evolução do projeto e não foram consideradas implementadas nesta fase.

---

15. Objetivo Educacional

O projeto demonstra, em ambiente controlado, como práticas de CI/CD podem reduzir os riscos associados a processos manuais de implantação.

A atividade permitiu aplicar conceitos de:

- Integração Contínua;
- Entrega Contínua;
- Fail Fast;
- Quality Gate;
- testes automatizados;
- análise estática;
- containerização;
- homologação;
- testes E2E;
- aprovação manual antes da produção.

---

## Autoria

**AlexsandraSeravat**

Projeto acadêmico desenvolvido durante a formação em **DevOps da FAP - Aponti**.

Implementação prática desenvolvida para fins educacionais e de portfólio.
