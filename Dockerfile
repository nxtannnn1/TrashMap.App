# Use uma imagem oficial do OpenJDK 17
FROM openjdk:17-ea-21-slim-buster

# Cria diretório de trabalho
WORKDIR /app

# Copia o jar do backend
COPY build/libs/trashmap-0.0.1-SNAPSHOT.jar trashmap.jar

# Expõe a porta do Spring Boot
EXPOSE 8080

# Comando para rodar a aplicação
ENTRYPOINT ["java", "-jar", "trashmap.jar"]
