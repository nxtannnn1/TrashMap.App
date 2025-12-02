# TrashMap Backend – Presets

## O que é "Presets"

A camada Presets é responsável por fornecer dados e configurações iniciais pré-definidos para a aplicação. Esses arquivos ajudam a popular o sistema com informações básicas, garantindo que ele funcione corretamente desde a primeira execução, sem depender de dados externos.

## Exemplos típicos de Presets:

1. Endereços de teste (EnderecoPreset)
2. Pontos de coleta padrão (PontoDeColetaPreset)
3. Rotas de exemplo (RotaPreset)

## Por que utilizar Presets?

1. Rapidez no desenvolvimento: fornece dados prontos para testes e demonstrações;
2. Consistência: garante que todos os ambientes (dev, test) tenham os mesmos dados iniciais;
3. Automação de testes: facilita a criação de cenários padronizados para testes unitários e integração;
4. Segurança: evita dependência de dados sensíveis ou externos durante desenvolvimento.

## Boas práticas no uso de Presets

1. Separação de contexto: cada preset deve representar um conjunto lógico de dados;
2. Imutabilidade: evite alterar presets em tempo de execução, mantenha-os como referência estática;
3. Documentação clara: cada preset deve conter informações sobre seu propósito e uso;
4. Não substituir a camada de produção: presets são para desenvolvimento, testes e demonstração — nunca devem substituir dados reais em produção.

## Conclusão

A camada Presets garante que o TrashMap Backend possa ser iniciado rapidamente com dados confiáveis e consistentes. Ela acelera o desenvolvimento, melhora a testabilidade e padroniza o ambiente de trabalho, sem impactar a lógica de negócio da aplicação.