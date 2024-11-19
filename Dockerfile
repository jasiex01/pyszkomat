FROM maven:3-eclipse-temurin-22-alpine AS build

WORKDIR /app

COPY ./app/pom.xml .
COPY ./app/src ./src

RUN mvn clean package

FROM openjdk:22 AS runtime

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]