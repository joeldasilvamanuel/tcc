const db = require('../config/db');

const AgendamentoModel = {
    // Buscar todas as especialidades para carregar no select da tela
    buscarEspecialidades: async () => {
        // Exemplo SQL: SELECT id, nome FROM especialidades
        // return await db.query("SELECT id, nome FROM especialidades ORDER BY nome");

        // Mock de dados temporário para testes:
        return [
            { id: 1, nome: "Clínica Geral" },
            { id: 2, nome: "Pediatria" },
            { id: 3, nome: "Cardiologia" },
            { id: 4, nome: "Ginecologia" }
        ];
    },

    // Verificar se o horário já está ocupado por outro paciente
    verificarDisponibilidade: async (id_esp, data, hora) => {
        // Evita que duas pessoas agendem a mesma especialidade/médico no mesmo minuto
        // return await db.query("SELECT id FROM agendamentos WHERE id_esp = ? AND data_consulta = ? AND hora_consulta = ?", [id_esp, data, hora]);

        return false; // Retorna false se o horário estiver LIVRE
    },

    // Salvar o agendamento no banco
    criar: async (dados) => {
        const { nome_completo, telefone, email, id_esp, data_consulta, hora_consulta, observacoes } = dados;

        // Exemplo SQL: INSERT INTO agendamentos (...) VALUES (...)
        // const resultado = await db.query("INSERT INTO agendamentos ...", [...]);
        // return resultado;

        return { id: Math.floor(Math.random() * 10000), ...dados };
    }
};

module.exports = AgendamentoModel;