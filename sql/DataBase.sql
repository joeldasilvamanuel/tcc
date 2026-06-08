--

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `clinica_arco_iris`
--
CREATE DATABASE IF NOT EXISTS `clinica_arco_iris` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `clinica_arco_iris`;

-- --------------------------------------------------------

--
-- Estrutura da tabela `administrador`
--

DROP TABLE IF EXISTS `administrador`;
CREATE TABLE IF NOT EXISTS `administrador` (
  `id_admin` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `tipo_admin` enum('admin_geral','admin_clinica') NOT NULL,
  PRIMARY KEY (`id_admin`),
  KEY `id_usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `agendamentos`
--

DROP TABLE IF EXISTS `agendamentos`;
CREATE TABLE IF NOT EXISTS `agendamentos` (
  `id_agenda` int(11) NOT NULL AUTO_INCREMENT,
  `nome_completo` varchar(100) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `id_esp` int(11) NOT NULL,
  `data_consulta` date NOT NULL,
  `horario_consulta` time NOT NULL,
  `observacoes` text DEFAULT NULL,
  `status` enum('Pendente','Confirmado','Cancelado','Realizado','Nao_compareceu') NOT NULL DEFAULT 'Pendente',
  `data_cadastro` datetime DEFAULT current_timestamp(),
  `id_medico` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_agenda`),
  KEY `id_esp` (`id_esp`),
  KEY `fk_agendamento_medico` (`id_medico`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `agendamentos`
--

INSERT INTO `agendamentos` (`id_agenda`, `nome_completo`, `telefone`, `email`, `id_esp`, `data_consulta`, `horario_consulta`, `observacoes`, `status`, `data_cadastro`, `id_medico`) VALUES
(1, 'Joel Manuel', '937486436', 'joelesiohelio@gmail.com', 1, '2026-05-21', '19:41:00', 'Oi, como vai.', 'Confirmado', '2026-05-20 16:41:32', NULL),
(2, 'Joel Manuel', '937486436', 'joelesiohelio@gmail.com', 1, '2026-05-22', '19:47:00', 'oioioi\n', 'Confirmado', '2026-05-20 16:47:38', NULL),
(3, 'Joel Manuel', '937486436', 'joelesiohelio@gmail.com', 6, '2026-06-13', '06:00:00', 'Dia da defesa.', 'Cancelado', '2026-05-20 21:29:54', NULL),
(4, 'Joel Da Silva Manuel', '937 486 436', NULL, 3, '2026-08-01', '06:00:00', 'ISPTEC', 'Cancelado', '2026-05-20 21:55:35', NULL),
(5, 'Joel Manuel', '912 345 678', 'joelesiohelio@gmail.com', 5, '2026-05-24', '07:30:00', 'Testando...', 'Confirmado', '2026-05-20 23:24:10', NULL),
(6, 'Joel Manuel', '937486436', 'joelesiohelio@gmail.com', 1, '2026-06-04', '14:53:00', 'aaaaa', 'Confirmado', '2026-06-03 13:53:48', NULL),
(7, 'Joel Manuel', '937486436', 'joelesiohelio@gmail.com', 6, '2026-06-05', '20:00:00', 'ccccccc', 'Confirmado', '2026-06-03 14:00:14', NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `alerta`
--

DROP TABLE IF EXISTS `alerta`;
CREATE TABLE IF NOT EXISTS `alerta` (
  `id_alerta` int(11) NOT NULL AUTO_INCREMENT,
  `id_utente` int(11) NOT NULL,
  `mensagem` text DEFAULT NULL,
  `lido` tinyint(1) DEFAULT 0,
  `data_hora` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_tipo_alerta` int(11) NOT NULL,
  `estado` enum('ativo','resolvido') DEFAULT 'ativo',
  PRIMARY KEY (`id_alerta`),
  KEY `id_utente` (`id_utente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `clinica`
--

DROP TABLE IF EXISTS `clinica`;
CREATE TABLE IF NOT EXISTS `clinica` (
  `id_clinica` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `endereco` text DEFAULT NULL,
  PRIMARY KEY (`id_clinica`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `condicao_medica`
--

DROP TABLE IF EXISTS `condicao_medica`;
CREATE TABLE IF NOT EXISTS `condicao_medica` (
  `id_condicao` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `descricao` text DEFAULT NULL,
  PRIMARY KEY (`id_condicao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `conversa`
--

DROP TABLE IF EXISTS `conversa`;
CREATE TABLE IF NOT EXISTS `conversa` (
  `id_conversa` int(11) NOT NULL AUTO_INCREMENT,
  `data_inicio` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_conversa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `conversa_participante`
--

DROP TABLE IF EXISTS `conversa_participante`;
CREATE TABLE IF NOT EXISTS `conversa_participante` (
  `id_conversa` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  PRIMARY KEY (`id_conversa`,`id_usuario`),
  KEY `id_usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `especialidades`
--

DROP TABLE IF EXISTS `especialidades`;
CREATE TABLE IF NOT EXISTS `especialidades` (
  `id_esp` int(11) NOT NULL AUTO_INCREMENT,
  `nome_esp` varchar(50) NOT NULL,
  PRIMARY KEY (`id_esp`),
  UNIQUE KEY `nome_esp` (`nome_esp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `especialidades`
--

INSERT INTO `especialidades` (`id_esp`, `nome_esp`) VALUES
(1, 'Cardiologia'),
(6, 'Clínica Geral'),
(3, 'Dermatologia'),
(5, 'Ginecologia'),
(7, 'Neurologia'),
(4, 'Ortopedia'),
(2, 'Pediatria');

-- --------------------------------------------------------

--
-- Estrutura da tabela `habito`
--

DROP TABLE IF EXISTS `habito`;
CREATE TABLE IF NOT EXISTS `habito` (
  `id_habito` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  PRIMARY KEY (`id_habito`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `leitura_sensor`
--

DROP TABLE IF EXISTS `leitura_sensor`;
CREATE TABLE IF NOT EXISTS `leitura_sensor` (
  `id_leitura` int(11) NOT NULL AUTO_INCREMENT,
  `id_wearable` int(11) NOT NULL,
  `data_hora` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_sensor` int(11) NOT NULL,
  `origem` varchar(20) DEFAULT 'automatico',
  PRIMARY KEY (`id_leitura`),
  KEY `id_wearable` (`id_wearable`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `medicacao`
--

DROP TABLE IF EXISTS `medicacao`;
CREATE TABLE IF NOT EXISTS `medicacao` (
  `id_medicacao` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `descricao` text DEFAULT NULL,
  PRIMARY KEY (`id_medicacao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `medico`
--

DROP TABLE IF EXISTS `medico`;
CREATE TABLE IF NOT EXISTS `medico` (
  `id_medico` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  PRIMARY KEY (`id_medico`),
  KEY `id_usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `medico_especialidade`
--

DROP TABLE IF EXISTS `medico_especialidade`;
CREATE TABLE IF NOT EXISTS `medico_especialidade` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_medico` int(11) NOT NULL,
  `id_esp` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_medico` (`id_medico`),
  KEY `id_esp` (`id_esp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `mensagem`
--

DROP TABLE IF EXISTS `mensagem`;
CREATE TABLE IF NOT EXISTS `mensagem` (
  `id_mensagem` int(11) NOT NULL AUTO_INCREMENT,
  `id_remetente` int(11) NOT NULL,
  `id_destinatario` int(11) NOT NULL,
  `conteudo` text NOT NULL,
  `lida` tinyint(1) DEFAULT 0,
  `data_envio` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_mensagem`),
  KEY `id_remetente` (`id_remetente`),
  KEY `id_destinatario` (`id_destinatario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `profissional`
--

DROP TABLE IF EXISTS `profissional`;
CREATE TABLE IF NOT EXISTS `profissional` (
  `id_profissional` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `especialidade` varchar(100) DEFAULT NULL,
  `numero_ordem` varchar(50) DEFAULT NULL,
  `contacto` varchar(20) DEFAULT NULL,
  `cargo` enum('medico','enfermeiro','tecnico') DEFAULT 'medico',
  `disponivel` tinyint(1) DEFAULT 1,
  `categoria` enum('medico','enfermeiro','recepcionista') NOT NULL,
  PRIMARY KEY (`id_profissional`),
  UNIQUE KEY `numero_ordem` (`numero_ordem`),
  KEY `id_usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `registro_habito`
--

DROP TABLE IF EXISTS `registro_habito`;
CREATE TABLE IF NOT EXISTS `registro_habito` (
  `id_registro` int(11) NOT NULL AUTO_INCREMENT,
  `id_utente` int(11) NOT NULL,
  `id_habito` int(11) NOT NULL,
  `frequencia` varchar(50) DEFAULT NULL,
  `data_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_registro`),
  KEY `id_utente` (`id_utente`),
  KEY `id_habito` (`id_habito`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `registro_medicacao`
--

DROP TABLE IF EXISTS `registro_medicacao`;
CREATE TABLE IF NOT EXISTS `registro_medicacao` (
  `id_registro` int(11) NOT NULL AUTO_INCREMENT,
  `id_utente` int(11) NOT NULL,
  `id_medicacao` int(11) NOT NULL,
  `dosagem` varchar(50) DEFAULT NULL,
  `frequencia` varchar(50) DEFAULT NULL,
  `data_inicio` date DEFAULT NULL,
  `data_fim` date DEFAULT NULL,
  PRIMARY KEY (`id_registro`),
  KEY `id_utente` (`id_utente`),
  KEY `id_medicacao` (`id_medicacao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `registro_sintoma`
--

DROP TABLE IF EXISTS `registro_sintoma`;
CREATE TABLE IF NOT EXISTS `registro_sintoma` (
  `id_registro` int(11) NOT NULL AUTO_INCREMENT,
  `id_utente` int(11) NOT NULL,
  `id_sintoma` int(11) NOT NULL,
  `intensidade` enum('leve','moderada','grave') DEFAULT NULL,
  `data_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_registro`),
  KEY `id_utente` (`id_utente`),
  KEY `id_sintoma` (`id_sintoma`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `sintoma`
--

DROP TABLE IF EXISTS `sintoma`;
CREATE TABLE IF NOT EXISTS `sintoma` (
  `id_sintoma` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  PRIMARY KEY (`id_sintoma`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tipo_alerta`
--

DROP TABLE IF EXISTS `tipo_alerta`;
CREATE TABLE IF NOT EXISTS `tipo_alerta` (
  `id_tipo_alerta` int(11) NOT NULL AUTO_INCREMENT,
  `descricao` varchar(100) NOT NULL,
  `nivel` enum('baixo','medio','alto') NOT NULL,
  PRIMARY KEY (`id_tipo_alerta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `tipo_sensor`
--

DROP TABLE IF EXISTS `tipo_sensor`;
CREATE TABLE IF NOT EXISTS `tipo_sensor` (
  `id_sensor` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `unidade_medida` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_sensor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `token_autenticacao`
--

DROP TABLE IF EXISTS `token_autenticacao`;
CREATE TABLE IF NOT EXISTS `token_autenticacao` (
  `id_token` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expira_em` datetime NOT NULL,
  PRIMARY KEY (`id_token`),
  KEY `id_usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuario`
--

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE IF NOT EXISTS `usuario` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha_hash` varchar(255) NOT NULL,
  `tipo_usuario` enum('utente','medico','enfermeiro','recepcionista','admin_geral','admin_clinica') NOT NULL DEFAULT 'utente',
  `ativo` tinyint(1) DEFAULT 1,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  `foto_perfil` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nome`, `email`, `senha_hash`, `tipo_usuario`, `ativo`, `criado_em`, `foto_perfil`) VALUES
(1, 'Joel Da Silva Manuel', 'joelesiohelio@gmail.com', '$2b$10$jbEwVXpbjrDdF6bQ6GyVL.L1MaVgHQKMiBZX/qV4dgvcvO2/wv9YG', 'utente', 1, '2026-05-25 00:33:19', NULL),
(3, 'Neide Natalina Da Silva Manuel', 'Neidenatalinadasilva@gmail.com', '$2b$10$F12pKPTHLSKzhKOlrxEVouoWMqYFe8gBaqr9U98GYXi7nNoznwjiK', 'utente', 1, '2026-04-22 17:34:45', '/uploads/perfil/user_3_1777121876110.png'),
(4, 'João Kiala', 'kiala@gmail.com', '$2b$10$dHDfaw0EDtCWAmmO4nU4HeBgjk8ai2vbgK4I72wYsDP2HRT4kHJsG', 'medico', 1, '2026-04-22 18:34:57', '/uploads/perfil/user_4_1777123192544.jpg'),
(5, 'admin', 'admin@gmail.com', '$2b$10$dHDfaw0EDtCWAmmO4nU4HeBgjk8ai2vbgK4I72wYsDP2HRT4kHJsG', 'admin_geral', 1, '2026-04-23 12:59:02', NULL),
(6, 'Daniel Rogério', 'rogeriodaniel@gmail.com', '$2b$10$AKFbsaNdNLl.Ym50A0JCrueD6Den0flN2FSUf1Q.QgpzE9N/krV8m', 'medico', 1, '2026-04-29 14:32:38', NULL),
(7, 'Felicidade Lourenço', 'felilo@gmail.com', '$2b$10$iHoO/KReFkJ7j1xBrHvjYuSNYQzBcoxpVDjTuoQakByh2Ih35bkDS', 'admin_clinica', 1, '2026-04-30 09:56:19', NULL),
(9, 'Genivaldo José', 'gejose@gmail.com', '$2b$10$dHDfaw0EDtCWAmmO4nU4HeBgjk8ai2vbgK4I72wYsDP2HRT4kHJsG', 'recepcionista', 1, '2026-05-12 16:56:16', '/uploads/perfil/user_9_1780349574030.jpeg'),
(10, 'Saron Kondi Massa Kanda', 'saron@gmail.com', '$2b$10$dHDfaw0EDtCWAmmO4nU4HeBgjk8ai2vbgK4I72wYsDP2HRT4kHJsG', 'enfermeiro', 1, '2026-05-13 13:42:46', '/uploads/perfil/user_10_1778681890193.jpg'),
(11, 'Ruben Franscisco', 'rubenfrancisco@gmail.com', '$2b$10$k.ouYZFZ8mNgSpRYR1wGuO2lKZiGanvHFSYvjdLHRQ3oI8KEnVxEq', 'medico', 1, '2026-05-24 21:54:10', NULL),
(12, 'Celeste Francisco', 'cilafran@gmail.com', '$2b$10$S5DdVeidy2czyifuzoxiQOhZyWDiWbvs.MeQDQnT8iNktUMLhsOGu', 'admin_clinica', 1, '2026-05-24 22:04:26', NULL),
(13, 'Leocádia Francisco', 'lf@gmail.com', '$2b$10$9o4xWzWpqo2N2WbZPjP3y.ANorsJRSKNJi6oVYR1AVn1OGkRbJsy6', 'medico', 1, '2026-05-24 22:16:25', NULL),
(15, 'Soraya Andreia da Silva Manuel António', 'soraya@gmail.com', '$2b$10$PS0SPVshi8txFgTYEPEal.TkKj2keKEq0J4xXaKtoR2OkATz9238u', 'utente', 1, '2026-05-25 00:20:06', NULL),
(18, 'Marta Catarina', 'mc@gmail.com', '$2b$10$gQgzNJAA0HJp9EMgKoy/OuBJOTLWT0pGMtVHty1G3LeirPrwDb/46', 'utente', 1, '2026-06-01 20:52:44', NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `utente`
--

DROP TABLE IF EXISTS `utente`;
CREATE TABLE IF NOT EXISTS `utente` (
  `id_utente` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `data_nascimento` date DEFAULT NULL,
  `sexo` enum('masculino','feminino','outro') DEFAULT NULL,
  `contacto` varchar(20) DEFAULT NULL,
  `endereco` text DEFAULT NULL,
  PRIMARY KEY (`id_utente`),
  KEY `id_usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `utente`
--

INSERT INTO `utente` (`id_utente`, `id_usuario`, `data_nascimento`, `sexo`, `contacto`, `endereco`) VALUES
(2, 3, '2002-12-25', 'feminino', NULL, NULL),
(4, 6, '2001-01-01', 'masculino', NULL, NULL),
(5, 7, '2003-03-17', 'feminino', NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `utente_condicao`
--

DROP TABLE IF EXISTS `utente_condicao`;
CREATE TABLE IF NOT EXISTS `utente_condicao` (
  `id_utente` int(11) NOT NULL,
  `id_condicao` int(11) NOT NULL,
  `data_diagnostico` date DEFAULT NULL,
  PRIMARY KEY (`id_utente`,`id_condicao`),
  KEY `id_condicao` (`id_condicao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `wearable`
--

DROP TABLE IF EXISTS `wearable`;
CREATE TABLE IF NOT EXISTS `wearable` (
  `id_wearable` int(11) NOT NULL AUTO_INCREMENT,
  `id_utente` int(11) NOT NULL,
  `codigo_dispositivo` varchar(50) NOT NULL,
  `ativo` tinyint(1) DEFAULT 1,
  `data_registo` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_wearable`),
  UNIQUE KEY `codigo_dispositivo` (`codigo_dispositivo`),
  KEY `id_utente` (`id_utente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `administrador`
--
ALTER TABLE `administrador`
  ADD CONSTRAINT `administrador_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `agendamentos`
--
ALTER TABLE `agendamentos`
  ADD CONSTRAINT `agendamentos_ibfk_1` FOREIGN KEY (`id_esp`) REFERENCES `especialidades` (`id_esp`),
  ADD CONSTRAINT `fk_agendamento_medico` FOREIGN KEY (`id_medico`) REFERENCES `medico` (`id_medico`) ON DELETE SET NULL;

--
-- Limitadores para a tabela `alerta`
--
ALTER TABLE `alerta`
  ADD CONSTRAINT `alerta_ibfk_1` FOREIGN KEY (`id_utente`) REFERENCES `utente` (`id_utente`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `conversa_participante`
--
ALTER TABLE `conversa_participante`
  ADD CONSTRAINT `conversa_participante_ibfk_1` FOREIGN KEY (`id_conversa`) REFERENCES `conversa` (`id_conversa`),
  ADD CONSTRAINT `conversa_participante_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Limitadores para a tabela `leitura_sensor`
--
ALTER TABLE `leitura_sensor`
  ADD CONSTRAINT `leitura_sensor_ibfk_1` FOREIGN KEY (`id_wearable`) REFERENCES `wearable` (`id_wearable`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `medico`
--
ALTER TABLE `medico`
  ADD CONSTRAINT `medico_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `medico_especialidade`
--
ALTER TABLE `medico_especialidade`
  ADD CONSTRAINT `medico_especialidade_ibfk_1` FOREIGN KEY (`id_medico`) REFERENCES `medico` (`id_medico`) ON DELETE CASCADE,
  ADD CONSTRAINT `medico_especialidade_ibfk_2` FOREIGN KEY (`id_esp`) REFERENCES `especialidades` (`id_esp`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `mensagem`
--
ALTER TABLE `mensagem`
  ADD CONSTRAINT `mensagem_ibfk_1` FOREIGN KEY (`id_remetente`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `mensagem_ibfk_2` FOREIGN KEY (`id_destinatario`) REFERENCES `usuario` (`id_usuario`);

--
-- Limitadores para a tabela `profissional`
--
ALTER TABLE `profissional`
  ADD CONSTRAINT `profissional_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `registro_habito`
--
ALTER TABLE `registro_habito`
  ADD CONSTRAINT `registro_habito_ibfk_1` FOREIGN KEY (`id_utente`) REFERENCES `utente` (`id_utente`),
  ADD CONSTRAINT `registro_habito_ibfk_2` FOREIGN KEY (`id_habito`) REFERENCES `habito` (`id_habito`);

--
-- Limitadores para a tabela `registro_medicacao`
--
ALTER TABLE `registro_medicacao`
  ADD CONSTRAINT `registro_medicacao_ibfk_1` FOREIGN KEY (`id_utente`) REFERENCES `utente` (`id_utente`),
  ADD CONSTRAINT `registro_medicacao_ibfk_2` FOREIGN KEY (`id_medicacao`) REFERENCES `medicacao` (`id_medicacao`);

--
-- Limitadores para a tabela `registro_sintoma`
--
ALTER TABLE `registro_sintoma`
  ADD CONSTRAINT `registro_sintoma_ibfk_1` FOREIGN KEY (`id_utente`) REFERENCES `utente` (`id_utente`),
  ADD CONSTRAINT `registro_sintoma_ibfk_2` FOREIGN KEY (`id_sintoma`) REFERENCES `sintoma` (`id_sintoma`);

--
-- Limitadores para a tabela `token_autenticacao`
--
ALTER TABLE `token_autenticacao`
  ADD CONSTRAINT `token_autenticacao_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `utente`
--
ALTER TABLE `utente`
  ADD CONSTRAINT `utente_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `utente_condicao`
--
ALTER TABLE `utente_condicao`
  ADD CONSTRAINT `utente_condicao_ibfk_1` FOREIGN KEY (`id_utente`) REFERENCES `utente` (`id_utente`),
  ADD CONSTRAINT `utente_condicao_ibfk_2` FOREIGN KEY (`id_condicao`) REFERENCES `condicao_medica` (`id_condicao`);

--
-- Limitadores para a tabela `wearable`
--
ALTER TABLE `wearable`
  ADD CONSTRAINT `wearable_ibfk_1` FOREIGN KEY (`id_utente`) REFERENCES `utente` (`id_utente`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;