# TrashMap Backend – Domain

## O que é "Domain"

Domain representa a camada que contém as regras centrais e abstrações do negócio.  
Ela define entidades, valores e comportamentos que refletem o problema que o sistema busca resolver.

## Por que utilizar Domain?

1. Foco no negócio: concentra a lógica que define o comportamento essencial do sistema;
2. Coesão: mantém regras e conceitos relacionados agrupados;
3. Reutilização: abstrações podem ser compartilhadas entre serviços e camadas;
4. Independência: reduz acoplamento com infraestrutura e frameworks;

## Boas práticas no uso de Domain

1. Clareza: modelos e regras devem ser autoexplicativos e consistentes;
2. Separação: evitar misturar lógica de persistência ou apresentação;
3. Imutabilidade: quando possível, utilizar objetos imutáveis para garantir consistência;
4. Documentação: registrar decisões de design e comportamento esperado;

## Conclusão

Domain organiza e protege a lógica central do sistema, garantindo que regras de negócio sejam aplicadas de maneira clara e consistente.
