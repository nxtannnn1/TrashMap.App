# TrashMap Backend – Exception

## O que é "Exception"

Exception representa a camada responsável por tratar erros e situações inesperadas que podem ocorrer durante a execução da aplicação.  
Ela organiza e padroniza a geração, captura e propagação de exceções.

## Por que utilizar Exception?

1. Robustez: garante que falhas sejam detectadas e tratadas adequadamente;
2. Padronização: fornece mensagens consistentes e códigos de erro claros;
3. Diagnóstico: facilita a identificação de problemas durante desenvolvimento e produção;
4. Controle de fluxo: permite reagir a situações inesperadas sem comprometer o sistema;

## Boas práticas no uso de Exception

1. Hierarquia clara: definir exceções específicas para cada tipo de erro;
2. Mensagens informativas: fornecer informações úteis sem expor detalhes sensíveis;
3. Captura seletiva: tratar apenas exceções previstas e permitir que outras sejam propagadas;
4. Logging: registrar erros para monitoramento e auditoria;

## Conclusão

A camada de Exception aumenta a confiabilidade da aplicação e fornece um mecanismo estruturado para tratamento de falhas.
