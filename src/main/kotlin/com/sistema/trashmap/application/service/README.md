# TrashMap Backend – Service

## O que é "Service"

Service representa a camada responsável por concentrar a lógica de negócio da aplicação.  
Ela processa dados, aplica regras, valida fluxos e interage com repositories e outros serviços.

## Por que utilizar Service?

1. Centralização da lógica de negócio: mantém regras e operações em um único local;
2. Reutilização: métodos de serviço podem ser chamados por diferentes controllers;
3. Testabilidade: facilita testes unitários da lógica de negócio;
4. Separação de camadas: mantém a controller focada em comunicação e a repository em persistência;

## Boas práticas no uso de Service

1. Clareza: cada serviço deve ter responsabilidade bem definida;
2. Modularidade: separar serviços por contexto ou entidade de domínio;
3. Simplicidade: métodos claros, coesos e de fácil manutenção;
4. Tratamento de exceções: gerenciar erros e estados inesperados de forma consistente;

## Conclusão

Services estruturam a lógica de negócio de maneira organizada e centralizada.  
Eles permitem manutenção simplificada, testes confiáveis e garantem que regras de negócio estejam aplicadas de forma consistente em todo o sistema.