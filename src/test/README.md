# TrashMap Backend – Test

## O que é a pasta "Test"

A pasta `test` contém recursos, arquivos e exemplos destinados a testes da aplicação.  
Ela é utilizada para validar funcionalidades, integração entre componentes e comportamento esperado do backend sem impactar dados de produção.

## Por que utilizar a pasta Test?

1. Isolamento: mantém arquivos e dados de teste separados da aplicação principal;
2. Reutilização: arquivos de teste podem ser utilizados por múltiplos casos de teste;
3. Organização: facilita localizar scripts e recursos específicos de teste;
4. Segurança: evita que dados sensíveis ou de produção sejam manipulados acidentalmente durante testes;

## Estrutura e boas práticas

1. Arquivos de configuração: pode conter `application-test.yml` ou versões específicas de arquivos de configuração;
2. Dados de teste: JSON, CSV ou scripts que simulam informações reais;
3. Scripts e fixtures: recursos utilizados para popular bancos temporários ou mocks;
4. Documentação: incluir README nesta pasta ajuda a entender o propósito de cada arquivo de teste;

## Conclusão

A pasta `test` organiza recursos e dados voltados a testes, garantindo isolamento e segurança.  
Manter documentação clara dentro desta pasta facilita entendimento, manutenção e evolução das funcionalidades de teste.
