const { connection: db } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const AgendamentoModel = require('../models/agendamentoModel');

const agendamentoController = {
    // Carrega a página HTML de agendamento
    exibirTelaAgendar: (req, res) => {
        // Se estiver usando EJS/Pug: res.render('utente/agendar');
        // Se for HTML puro na pasta views:
        res.sendFile('agendar.html', { root: './src/views' });
    },

    // API para alimentar o <select> de especialidades via fetch
    listarEspecialidades: async (req, res) => {
        try {
            const especialidades = await AgendamentoModel.buscarEspecialidades();
            return res.status(200).json(especialidades);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro ao buscar especialidades." });
        }
    },

    // Processa o envio do formulário (POST)
    salvarAgendamento: async (req, res) => {
        try {
            const { nome_completo, telefone, id_esp, data_consulta, hora_consulta } = req.body;

            // Validação básica de campos obrigatórios no servidor (Segurança)
            if (!nome_completo || !telefone || !id_esp || !data_consulta || !hora_consulta) {
                return res.status(400).json({ mensagem: "Por favor, preencha todos os campos obrigatórios." });
            }

            // Regra de Negócio: O horário já foi pego?
            const horarioOcupado = await AgendamentoModel.verificarDisponibilidade(id_esp, data_consulta, hora_consulta);
            if (horarioOcupado) {
                return res.status(409).json({ mensagem: "Este horário já foi preenchido. Escolha outro, por favor." });
            }

            // Se tudo estiver certo, salva no banco
            const novoAgendamento = await AgendamentoModel.criar(req.body);

            // Responde sucesso para o fetch do Frontend
            return res.status(201).json({ 
                sucesso: true, 
                mensagem: "Agendamento realizado com sucesso!",
                dados: novoAgendamento 
            });

        } catch (error) {
            console.error("Erro ao salvar consulta:", error);
            return res.status(500).json({ mensagem: "Erro interno no servidor ao processar o agendamento." });
        }
    }
};

module.exports = agendamentoController;