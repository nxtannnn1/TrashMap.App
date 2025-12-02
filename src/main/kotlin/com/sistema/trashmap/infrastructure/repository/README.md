# TrashMap Backend – Repository

## O que é "Repository"

Repository é a camada responsável por encapsular a lógica de acesso a dados, fornecendo métodos para consultar, persistir, atualizar e remover entidades.  
Ele atua como uma ponte entre os Models e a camada de infraestrutura de persistência.

## Por que utilizar Repository?

1. Abstração: esconde os detalhes do mecanismo de persistência;
2. Consistência: centraliza operações de acesso a dados em interfaces bem definidas;
3. Testabilidade: facilita a criação de testes unitários e mocks;
4. Manutenção: alterações no banco de dados ou ORM podem ser tratadas sem impactar outras camadas;

## Boas práticas no uso de Repository

1. Interfaces claras: definir métodos específicos para cada operação necessária;
2. Coesão: cada repository deve gerenciar apenas um tipo de entidade;
3. Evitar lógica de negócio: deixar apenas operações de persistência nesta camada;
4. Padronização: utilizar nomenclatura consistente para métodos de consulta e manipulação de dados;

## Conclusão

Repositories proporcionam uma abstração robusta para acesso a dados.  
Eles aumentam a clareza do código, facilitam testes e reduzem acoplamento entre a lógica de negócio e a persistência.
