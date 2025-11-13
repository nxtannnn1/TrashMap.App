# Use uma imagem oficial do OpenJDK 21
FROM amazoncorretto:21

# Cria diretório de trabalho
WORKDIR /app

# Copia o jar do backend
COPY build/libs/trashmap-0.0.1-SNAPSHOT.jar trashmap.jar

# Expõe a porta do Spring Boot
EXPOSE 8080

# Comando para rodar a aplicação
ENTRYPOINT ["java", "-jar", "trashmap.jar"]
