# TrashMap Backend – Config

## O que é "Config"

Config representa a camada responsável por armazenar e gerenciar configurações da aplicação, incluindo propriedades, beans e inicializações específicas de frameworks.  
Ela garante que parâmetros de comportamento, integração e ambiente sejam centralizados e facilmente modificáveis.

## Por que utilizar Config?

1. Centralização: mantém todas as configurações da aplicação em um ponto único;
2. Flexibilidade: permite ajustes sem alterar código-fonte;
3. Integração: facilita a inicialização de frameworks e componentes;
4. Manutenção: simplifica alterações em ambientes distintos (desenvolvimento, teste, produção);

## Boas práticas no uso de Config

1. Separação por contexto: organizar configurações por domínio ou propósito;
2. Evitar lógica de negócio: a configuração deve se limitar a parâmetros e inicializações;
3. Uso de perfis: diferenciar ambientes usando perfis (dev, test, prod);
4. Segurança: nunca incluir dados sensíveis diretamente no código, usar variáveis de ambiente ou cofres de segredo;

## Conclusão

A camada de Config garante organização, flexibilidade e segurança na gestão de parâmetros e inicializações da aplicação.
