# TrashMap Backend – Resources

## O que são "Resources"

A pasta `resources` contém arquivos e recursos utilizados pelo backend durante a execução da aplicação.  
Ela inclui arquivos de configuração, scripts, templates e outros artefatos que não fazem parte diretamente do código-fonte.

## Por que utilizar Resources?

1. Centralização: mantém todos os recursos estáticos e de configuração em um único local;
2. Integração: arquivos nesta pasta são automaticamente detectados pelo Spring Boot;
3. Flexibilidade: facilita a manutenção e alteração de arquivos sem recompilar o código;
4. Organização: separa lógica de negócio do suporte e configuração do sistema;

## Estrutura e boas práticas

1. Arquivos de configuração: `application.yml`, `application.properties` e perfis específicos (`application-dev.yml`, `application-prod.yml`);
2. Migrações de banco de dados: scripts devem estar em `db/migration/`;
3. Outros recursos: qualquer arquivo estático ou necessário para inicialização ou integração do sistema;
4. Segurança: nunca versionar credenciais sensíveis, utilize variáveis de ambiente ou cofres de segredo;

## Conclusão

A pasta `resources` organiza e centraliza os arquivos essenciais para execução e configuração do backend.  
Manter sua estrutura clara e documentada facilita manutenção, integração e evolução da aplicação.
