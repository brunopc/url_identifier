CREATE DATABASE URL_IDENTIFIER;
USE URL_IDENTIFIER;

CREATE TABLE Evaluation (
    id int NOT NULL AUTO_INCREMENT,
    verdict ENUM('Legal', 'Ilegal', '-'),
    reason text,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE Request (
    id int NOT NULL AUTO_INCREMENT,
    current_status ENUM('Aguardando processamento',
        'Processado', 'Respondido'),
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE Website (
    id int NOT NULL AUTO_INCREMENT,
    evaluation_id int NOT NULL,
    request_id int NOT NULL,
    url text,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (evaluation_id) REFERENCES Evaluation(id),
    FOREIGN KEY (request_id) REFERENCES Request(id),
    PRIMARY KEY (id),
    UNIQUE (evaluation_id, request_id)
);
