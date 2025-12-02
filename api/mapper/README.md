# TrashMap Backend – Mapper

## O que é "Mapper"

Mapper é responsável por transformar dados entre diferentes representações, como converter Models em DTOs e vice-versa.  
Ele assegura consistência na transferência de dados entre camadas, mantendo a separação de responsabilidades.

## Por que utilizar Mapper?

1. Separação de camadas: evita que Models e DTOs sejam manipulados diretamente em camadas incorretas;
2. Consistência: garante que dados convertidos mantenham integridade e formato esperado;
3. Reutilização: centraliza transformações comuns em um único local;
4. Redução de erros: diminui duplicação de código de conversão e inconsistências;

## Boas práticas no uso de Mapper

1. Clareza: métodos de conversão devem ter nomes autoexplicativos;
2. Reutilização: criar métodos genéricos para conversões frequentes;
3. Simplicidade: evitar lógica de negócio complexa dentro do mapper;
4. Testabilidade: garantir cobertura de testes para todas as transformações críticas;

## Conclusão

Mappers aumentam a consistência e organização na manipulação de dados entre camadas.  
Eles garantem que a transferência de informações seja clara, segura e fácil de manter.
