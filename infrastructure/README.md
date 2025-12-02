# TrashMap Backend – Infrastructure

## O que é "Infrastructure"

Infrastructure representa a camada responsável por prover suporte e serviços transversais ao sistema, como comunicação com bancos de dados, sistemas externos, filas de mensagens, cache e configuração de frameworks.  
Ela garante que as demais camadas possam se concentrar na lógica de negócio sem se preocupar com detalhes técnicos de integração.

## Por que utilizar Infrastructure?

1. Centralização: concentra integrações externas em um único ponto;
2. Reutilização: permite que serviços e utilitários sejam compartilhados entre diferentes módulos;
3. Abstração: oculta detalhes de implementação de componentes externos;
4. Manutenção: facilita a atualização de bibliotecas e configurações sem impactar a lógica de negócio;

## Boas práticas no uso de Infrastructure

1. Separação clara: manter apenas componentes de integração e suporte nesta camada;
2. Modularidade: organizar em pacotes ou módulos distintos para cada tipo de serviço;
3. Configuração externa: utilizar arquivos de configuração ou variáveis de ambiente sempre que possível;
4. Testabilidade: projetar componentes de forma a facilitar testes unitários e de integração;

## Conclusão

A camada de Infrastructure é essencial para manter a aplicação desacoplada e organizada.  
Ela permite que a lógica de negócio seja independente de frameworks e serviços externos, garantindo flexibilidade e manutenção simplificada.
