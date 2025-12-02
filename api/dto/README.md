# TrashMap Backend – DTO

## O que são "DTOs"

DTOs (*Data Transfer Objects*) são objetos projetados para transportar dados entre diferentes camadas da aplicação, sem expor diretamente a estrutura das entidades de domínio.  
Seu uso promove segurança, clareza e adaptação no fluxo de informações.

## Por que utilizar DTOs?

1. Encapsulamento: evitam expor diretamente os models em APIs;
2. Flexibilidade: permitem estruturar respostas e requisições de forma adaptada ao contexto;
3. Segurança: reduzem riscos de manipulação indevida de dados sensíveis;
4. Padronização: ajudam a manter contratos bem definidos entre backend e frontend;

## Boas práticas no uso de DTOs

1. Clareza: definir atributos que atendam exatamente ao caso de uso;
2. Imutabilidade: priorizar uso de objetos imutáveis para consistência;
3. Separação: evitar incluir regras de negócio nos DTOs;
4. Versionamento: quando necessário, versionar DTOs para manter compatibilidade entre clientes diferentes;

## Conclusão

DTOs desempenham um papel essencial na comunicação entre camadas e sistemas.  
Eles contribuem para a segurança, organizam fluxos de dados e reforçam a clareza na integração entre backend e frontend.
