# TrashMap Backend – Controller

## O que é "Controller"

Controller é a camada responsável por receber requisições externas, geralmente HTTP, e direcioná-las para os serviços apropriados.  
Ela atua como ponto de entrada da aplicação, lidando com validações de entrada e formatação de respostas.

## Por que utilizar Controller?

1. Centralização de entrada: gerencia todas as requisições externas;
2. Separação de responsabilidades: mantém a lógica de negócio fora desta camada;
3. Padronização: fornece respostas consistentes e códigos de status apropriados;
4. Integração: conecta o backend com clientes externos, APIs ou interfaces de usuário;

## Boas práticas no uso de Controller

1. Foco na comunicação: apenas validações simples e roteamento de requisições;
2. Delegação: todas as regras de negócio devem ser encaminhadas para a camada de Service;
3. Clareza: utilizar nomes de endpoints e métodos que expressem claramente a ação;
4. Tratamento de erros: capturar exceções e retornar respostas padronizadas;

## Conclusão

Controllers são essenciais para organizar a entrada de dados e interação com clientes externos.  
Eles fortalecem a separação de responsabilidades e garantem consistência na interface da aplicação.
