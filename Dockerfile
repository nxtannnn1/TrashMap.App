FROM openjdk:17-jdk-slim
WORKDIR /aplicacao
COPY build/libs/trashmap-0.0.1-SNAPSHOT.jar trashmap.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "trashmap.jar"]