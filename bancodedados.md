# base de dados: clinica_arco_iris (21 tabelas)

create database if not exists clinica_arco_iris;
use clinica_arco_iris;

## 1. tabela usuario
create table usuario (
id_usuario int auto_increment primary key,
nome varchar(100) not null,
email varchar(100) unique not null,
senha_hash varchar(255) not null,
tipo_usuario enum('utente', 'profissional', 'admin') not null,
ativo boolean default true,
criado_em timestamp default current_timestamp
);

## 2. tabela token_autenticacao
create table token_autenticacao (
id_token int auto_increment primary key,
id_usuario int not null,
token varchar(255) not null,
expira_em datetime not null,
foreign key (id_usuario) references usuario(id_usuario) on delete cascade
);

## 3. tabela utente
create table utente (
id_utente int auto_increment primary key,
id_usuario int not null,
data_nascimento date,
sexo enum('masculino', 'feminino', 'outro'),
contacto varchar(20),
endereco text,
foreign key (id_usuario) references usuario(id_usuario) on delete cascade
);

## 4. tabela profissional
create table profissional (
id_profissional int auto_increment primary key,
id_usuario int not null,
especialidade varchar(100),
numero_ordem varchar(50) unique,
contacto varchar(20),
foreign key (id_usuario) references usuario(id_usuario) on delete cascade
);

## 5. tabela condicao_medica
create table condicao_medica (
id_condicao int auto_increment primary key,
nome varchar(100) not null,
descricao text
);
## 6. tabela utente_condicao
create table utente_condicao (
id_utente int not null,
id_condicao int not null,
data_diagnostico date,
primary key (id_utente, id_condicao),
foreign key (id_utente) references utente(id_utente),
foreign key (id_condicao) references condicao_medica(id_condicao)
);

## 7. tabela wearable
create table wearable (
id_wearable int auto_increment primary key,
id_utente int not null,
codigo_dispositivo varchar(50) unique not null,
ativo boolean default true,
data_registo timestamp default current_timestamp,
foreign key (id_utente) references utente(id_utente)
);

## 8. tabela tipo_sensor
create table tipo_sensor (
id_sensor int auto_increment primary key,
nome varchar(50) not null,
unidade_medida varchar(20)
);

## 9. tabela leitura_sensor
create table leitura_sensor (
id_leitura int auto_increment primary key,
id_wearable int not null,
id_sensor int not null,
valor decimal(10,2) not null,
data_hora timestamp default current_timestamp,
origem varchar(20) default 'automatico',
foreign key (id_wearable) references wearable(id_wearable),
foreign key (id_sensor) references tipo_sensor(id_sensor)
);

## 10. tabela sintoma
create table sintoma (
id_sintoma int auto_increment primary key,
nome varchar(100) not null
);

## 11. tabela registro_sintoma
create table registro_sintoma (
id_registro int auto_increment primary key,
id_utente int not null,
id_sintoma int not null,
intensidade enum('leve', 'moderada', 'grave'),
data_registro timestamp default current_timestamp,
foreign key (id_utente) references utente(id_utente),
foreign key (id_sintoma) references sintoma(id_sintoma)
);

## 12. tabela medicacao
create table medicacao (
id_medicacao int auto_increment primary key,
nome varchar(100) not null,
descricao text
);

## 13. tabela registro_medicacao
create table registro_medicacao (
id_registro int auto_increment primary key,
id_utente int not null,
id_medicacao int not null,
dosagem varchar(50),
frequencia varchar(50),
data_inicio date,
data_fim date,
foreign key (id_utente) references utente(id_utente),
foreign key (id_medicacao) references medicacao(id_medicacao)
);

-- 14. tabela habito
create table habito (
id_habito int auto_increment primary key,
nome varchar(100) not null
);

## 15. tabela registro_habito
create table registro_habito (
id_registro int auto_increment primary key,
id_utente int not null,
id_habito int not null,
frequencia varchar(50),
data_registro timestamp default current_timestamp,
foreign key (id_utente) references utente(id_utente),
foreign key (id_habito) references habito(id_habito)
);

## 16. tabela tipo_alerta
create table tipo_alerta (
id_tipo_alerta int auto_increment primary key,
descricao varchar(100) not null,
nivel enum('baixo', 'medio', 'alto') not null
);

## 17. tabela alerta
create table alerta (
id_alerta int auto_increment primary key,
id_utente int not null,
id_tipo_alerta int not null,
mensagem text,
data_hora timestamp default current_timestamp,
estado enum('ativo', 'resolvido') default 'ativo',
foreign key (id_utente) references utente(id_utente),
foreign key (id_tipo_alerta) references tipo_alerta(id_tipo_alerta)
);

## 18. tabela conversa
create table conversa (
id_conversa int auto_increment primary key,
data_inicio timestamp default current_timestamp
);

## 19. tabela conversa_participante
create table conversa_participante (
id_conversa int not null,
id_usuario int not null,
primary key (id_conversa, id_usuario),
foreign key (id_conversa) references conversa(id_conversa),
foreign key (id_usuario) references usuario(id_usuario)
);

## 20. tabela mensagem
create table mensagem (
id_mensagem int auto_increment primary key,
id_conversa int not null,
id_usuario int not null,
conteudo text not null,
data_hora timestamp default current_timestamp,
foreign key (id_conversa) references conversa(id_conversa),
foreign key (id_usuario) references usuario(id_usuario)
);

## 21. tabela clinica
create table clinica (
id_clinica int auto_increment primary key,
nome varchar(100) not null,
endereco text
);

insert into clinica (nome, endereco) values ('clinica arco-iris', 'unidade central');
