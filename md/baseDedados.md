-- ==========================================================
-- SCRIPT ÚNICO: DATABASE CLINICA ARCO-ÍRIS (OTIMIZADO)
-- FOCO: IoT, Wearables e Gestão Clínica Simplificada
-- ==========================================================

CREATE DATABASE IF NOT EXISTS clinica_arco_iris
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE clinica_arco_iris;

-- 1. GESTÃO DE ACESSO E USUÁRIOS
-- Centraliza a autenticação. O tipo_usuario define as permissões no sistema.
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('utente', 'profissional', 'admin') NOT NULL DEFAULT 'utente',
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. PERFIL DO UTENTE (PACIENTE)
-- Dados específicos de quem utiliza o wearable.
CREATE TABLE utente (
    id_utente INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    data_nascimento DATE,
    sexo ENUM('masculino', 'feminino', 'outro'),
    contacto VARCHAR(20),
    endereco TEXT,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- 3. PERFIL DO PROFISSIONAL (MÉDICO/ENFERMEIRO)
-- Dados de quem monitoriza os utentes.
CREATE TABLE profissional (
    id_profissional INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    especialidade VARCHAR(100),
    cargo ENUM('medico', 'enfermeiro', 'tecnico') DEFAULT 'medico',
    numero_ordem VARCHAR(50) UNIQUE,
    disponivel BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- 4. INFRAESTRUTURA IOT (WEARABLES)
-- Cada dispositivo é vinculado a um utente específico.
CREATE TABLE wearable (
    id_wearable INT AUTO_INCREMENT PRIMARY KEY,
    id_utente INT NOT NULL,
    codigo_dispositivo VARCHAR(50) UNIQUE NOT NULL, -- Ex: ESP32-HEALTH-01
    bateria_nivel INT DEFAULT 100,
    ultima_conexao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_utente) REFERENCES utente(id_utente) ON DELETE CASCADE
);

-- 5. TELEMETRIA (LEITURAS DOS SENSORES)
-- Tabela otimizada: Recebe todos os dados do ESP32 em uma única inserção.
CREATE TABLE leitura_sensor (
    id_leitura INT AUTO_INCREMENT PRIMARY KEY,
    id_wearable INT NOT NULL,
    bpm INT, -- Batimentos Cardíacos
    oxigenio DECIMAL(5,2), -- SpO2 (Oximetria)
    temperatura DECIMAL(5,2), -- Temperatura Corporal
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_wearable) REFERENCES wearable(id_wearable) ON DELETE CASCADE
);

-- 6. INTELIGÊNCIA DE ALERTAS
-- Gerado automaticamente pelo backend quando as leituras saem do normal.
CREATE TABLE alerta (
    id_alerta INT AUTO_INCREMENT PRIMARY KEY,
    id_utente INT NOT NULL,
    tipo_alerta ENUM('critico', 'atencao', 'normal') DEFAULT 'atencao',
    mensagem TEXT, -- Ex: "Alerta: Oximetria abaixo de 90% detectada"
    lido BOOLEAN DEFAULT FALSE,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_utente) REFERENCES utente(id_utente) ON DELETE CASCADE
);

-- 7. PRONTUÁRIO MÉDICO RESUMIDO
-- Consolida o histórico clínico (condições, remédios e alergias) em campos de texto.
CREATE TABLE prontuario_resumo (
    id_prontuario INT AUTO_INCREMENT PRIMARY KEY,
    id_utente INT NOT NULL,
    condicoes_medicas TEXT,
    medicacao_atual TEXT,
    alergias TEXT,
    ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_utente) REFERENCES utente(id_utente) ON DELETE CASCADE
);

-- 8. COMUNICAÇÃO (CHAT INTERNO)
-- Sistema de mensagens simplificado entre perfis de usuário.
CREATE TABLE mensagem (
    id_mensagem INT AUTO_INCREMENT PRIMARY KEY,
    id_remetente INT NOT NULL, -- Referencia id_usuario
    id_destinatario INT NOT NULL, -- Referencia id_usuario
    conteudo TEXT NOT NULL,
    lida BOOLEAN DEFAULT FALSE,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_remetente) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_destinatario) REFERENCES usuario(id_usuario)
);

-- ==========================================================
-- OBSERVAÇÕES PARA O DESENVOLVIMENTO:
-- 1. O ON DELETE CASCADE garante que se um usuário for deletado,
--    seu perfil e dados de saúde também sejam removidos.
-- 2. Usei UTF8MB4 para garantir suporte total a caracteres especiais e emojis no chat.
-- 3. A tabela 'leitura_sensor' é a que sofrerá mais carga (INSERTs constantes do ESP32).
-- ==========================================================