# TrashMap Backend – Model

## O que são "Models"

Models representam as entidades centrais do domínio da aplicação, refletindo conceitos do mundo real em objetos do sistema.  
São a base da lógica de negócio, estabelecendo a estrutura de dados que será persistida e manipulada.

## Por que utilizar Models?

1. Estrutura clara: fornecem um mapeamento direto das entidades do sistema;
2. Persistência: geralmente associados ao banco de dados, facilitando operações de armazenamento e consulta;
3. Coerência: centralizam as regras e atributos essenciais de cada entidade;
4. Integração: servem como base para outras camadas, como DTOs e serviços;

## Boas práticas no uso de Models

1. Foco no domínio: limitar os atributos ao que é essencial para a entidade;
2. Consistência: manter padronização nos nomes e tipos de dados;
3. Separação de responsabilidades: evitar incluir regras de negócio complexas diretamente no model;
4. Evolução controlada: documentar alterações e garantir compatibilidade com o banco de dados;

## Conclusão

Models são o núcleo da representação de dados em um backend.  
Definindo corretamente as entidades, o sistema ganha em consistência, clareza e robustez ao longo de sua evolução.
