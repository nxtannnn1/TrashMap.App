# Etapa de build (opcional se você não quiser depender do Gradle local)
# FROM gradle:8.6-jdk17-alpine AS build
# COPY --chown=gradle:gradle . /home/gradle/src
# WORKDIR /home/gradle/src
# RUN gradle build -x test

# Etapa final
FROM openjdk:17-jdk-slim
WORKDIR /aplicacao

# Copia o jar gerado pelo build (ajuste o nome conforme o seu)
COPY build/libs/trashmap-0.0.1-SNAPSHOT.jar trashmap.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "trashmap.jar"]
