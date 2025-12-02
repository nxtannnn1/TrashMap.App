# TrashMap Backend – Enums

## O que são "Enums"

Um enum (abreviação de enumeration) é um tipo de dado especial utilizado para representar um conjunto fixo e limitado de valores constantes.  
O objetivo principal é substituir valores literais dispersos no código por representações semânticas claras e centralizadas.

## Por que utilizar Enums?

1. Legibilidade: tornam o código mais claro e compreensível;
2. Segurança de tipo: somente valores válidos podem ser atribuídos, evitando erros comuns de digitação ou uso incorreto;
3. Padronização: garantem consistência no domínio da aplicação;
4. Integração: são facilmente serializados em JSON, utilizados em APIs REST e mapeados para persistência em banco de dados;

## Boas práticas no uso de Enums

1. Nomenclatura clara: utilizar caixa alta para os valores, como PENDING, ACTIVE, INACTIVE;
2. Coerência semântica: cada enum deve ter um domínio específico e bem definido;
3. Domínios enxutos: evitar enums excessivamente extensos; quando necessário, dividi-los em contextos menores;
4. Documentação: mesmo que os nomes sejam autoexplicativos, comentários sucintos podem facilitar o entendimento;

## Conclusão

Enums são uma solução robusta para representar valores fixos dentro de um sistema.  
No desenvolvimento de backends, seu uso reduz ambiguidade, facilita manutenção, aumenta a clareza da lógica de negócio e fortalece a confiabilidade das integrações.
