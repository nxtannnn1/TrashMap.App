# TrashMap Backend – Application

## O que é "Application"

Application representa a camada principal que inicializa e coordena a execução do sistema, integrando todas as outras camadas e configurando o ambiente de execução.

## Por que utilizar Application?

1. Inicialização central: concentra a configuração e execução da aplicação;
2. Integração: conecta controllers, services, repositories e demais componentes;
3. Gestão de ciclo de vida: garante que beans, threads e recursos sejam inicializados corretamente;
4. Clareza: fornece um ponto único de entrada para desenvolvimento e execução;

## Boas práticas no uso de Application

1. Simplicidade: manter apenas inicialização e configuração de contexto;
2. Delegação: regras de negócio e lógica devem permanecer nas camadas apropriadas;
3. Organização: documentar o fluxo de inicialização;
4. Testabilidade: permitir execução em contextos de teste com configurações isoladas;

## Conclusão

A camada Application estrutura e organiza a execução do backend, proporcionando um ponto de entrada claro e controlado.
