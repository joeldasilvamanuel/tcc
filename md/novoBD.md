CREATE DATABASE IF NOT EXISTS clinica_arco_iris;
USE clinica_arco_iris;

-- 1. GESTÃO DE ACESSO (O coração do sistema e JWT)
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('utente', 'profissional', 'admin') NOT NULL DEFAULT 'utente',
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. PERFIS ESPECÍFICOS
CREATE TABLE utente (
    id_utente INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    data_nascimento DATE,
    sexo ENUM('masculino', 'feminino', 'outro'),
    contacto VARCHAR(20),
    endereco TEXT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

CREATE TABLE profissional (
    id_profissional INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    especialidade VARCHAR(100),
    cargo ENUM('medico', 'enfermeiro', 'tecnico') DEFAULT 'medico',
    numero_ordem VARCHAR(50) UNIQUE,
    disponivel BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- 3. INFRAESTRUTURA IoT (A base do teu TCC)
CREATE TABLE wearable (
    id_wearable INT AUTO_INCREMENT PRIMARY KEY,
    id_utente INT NOT NULL,
    codigo_dispositivo VARCHAR(50) UNIQUE NOT NULL, -- Ex: ESP32-HEALTH-01
    bateria_nivel INT DEFAULT 100,
    ultima_conexao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_utente) REFERENCES utente(id_utente) ON DELETE CASCADE
);

CREATE TABLE leitura_sensor (
    id_leitura INT AUTO_INCREMENT PRIMARY KEY,
    id_wearable INT NOT NULL,
    bpm INT, -- Batimentos Cardíacos
    oxigenio DECIMAL(5,2), -- SpO2
    temperatura DECIMAL(5,2), -- Temperatura Corporal
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_wearable) REFERENCES wearable(id_wearable) ON DELETE CASCADE
);

-- 4. INTELIGÊNCIA E ALERTAS (Lógica de Saúde)
CREATE TABLE alerta (
    id_alerta INT AUTO_INCREMENT PRIMARY KEY,
    id_utente INT NOT NULL,
    tipo_alerta ENUM('critico', 'atencao', 'normal') DEFAULT 'atencao',
    mensagem TEXT, -- Ex: "Frequência cardíaca elevada: 120 BPM"
    lido BOOLEAN DEFAULT FALSE,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_utente) REFERENCES utente(id_utente) ON DELETE CASCADE
);

-- 5. HISTÓRICO CLÍNICO RÁPIDO (Lógica de Prontuário)
CREATE TABLE prontuario_resumo (
    id_prontuario INT AUTO_INCREMENT PRIMARY KEY,
    id_utente INT NOT NULL,
    condicoes_medicas TEXT, -- Ex: "Diabetes Tipo 2, Hipertensão"
    medicacao_atual TEXT, -- Ex: "Metformina 500mg"
    alergias TEXT,
    ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_utente) REFERENCES utente(id_utente) ON DELETE CASCADE
);

-- 6. COMUNICAÇÃO (Chat Profissional-Utente)
CREATE TABLE mensagem (
    id_mensagem INT AUTO_INCREMENT PRIMARY KEY,
    id_remetente INT NOT NULL, -- id_usuario
    id_destinatario INT NOT NULL, -- id_usuario
    conteudo TEXT NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_remetente) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_destinatario) REFERENCES usuario(id_usuario)
);