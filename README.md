# TrashMap – Docker Compose

## O que é Docker Compose

Docker Compose é uma ferramenta que permite definir e gerenciar múltiplos containers Docker através de um único arquivo YAML (`docker-compose.yml`).  
Ele possibilita orquestrar serviços, redes e volumes de forma organizada, tornando o ambiente de desenvolvimento e teste reproduzível e consistente.

## Por que utilizar Docker Compose?

1. Automatização: inicia todos os serviços necessários com um único comando (`docker compose up`).
2. Isolamento: cada serviço roda em seu próprio container, evitando conflitos de dependências e versões.
3. Reprodutibilidade: garante que todos os desenvolvedores utilizem o mesmo ambiente.
4. Escalabilidade: facilita adicionar ou replicar serviços conforme a necessidade do projeto.
