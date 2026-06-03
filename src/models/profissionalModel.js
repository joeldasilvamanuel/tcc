const { connection: db } = require('../config/db');

class ProfissionalModel {

    // LISTAR TODOS OS PROFISSIONAIS
    static async listarProfissionais() {
        const query = `
            SELECT 
                u.id_usuario,
                u.nome,
                u.email,
                u.tipo_usuario,
                u.ativo,
                u.foto_perfil,
                GROUP_CONCAT(e.nome_esp SEPARATOR ', ') AS especialidades
            FROM usuario u
            LEFT JOIN medico_especialidade me 
                ON u.id_usuario = me.id_medico
            LEFT JOIN especialidades e
                ON me.id_esp = e.id_esp
            WHERE u.tipo_usuario IN (
                'medico',
                'enfermeiro',
                'recepcionista',
                'admin_clinica'
            )
            GROUP BY u.id_usuario
            ORDER BY u.criado_em DESC
        `;

        const [rows] = await db.promise().query(query);

        return rows;
    }

    // LISTAR ESPECIALIDADES
    static async listarEspecialidades() {
        const query = `
            SELECT * 
            FROM especialidades
            ORDER BY nome_esp ASC
        `;

        const [rows] = await db.promise().query(query);

        return rows;
    }

    // CRIAR PROFISSIONAL
    static async criarProfissional(dados) {

        const {
            nome,
            email,
            senha_hash,
            tipo_usuario,
            especialidades
        } = dados;

        // INSERIR UTILIZADOR
        const queryUsuario = `
            INSERT INTO usuario
            (
                nome,
                email,
                senha_hash,
                tipo_usuario
            )
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await db.promise().query(
            queryUsuario,
            [nome, email, senha_hash, tipo_usuario]
        );

        const idUsuario = result.insertId;

        // SE FOR MÉDICO → INSERIR ESPECIALIDADES
        if (
            tipo_usuario === 'medico' &&
            especialidades &&
            especialidades.length > 0
        ) {

            for (const idEsp of especialidades) {

                const queryEspecialidade = `
                    INSERT INTO medico_especialidade
                    (
                        id_medico,
                        id_esp
                    )
                    VALUES (?, ?)
                `;

                await db.promise().query(
                    queryEspecialidade,
                    [idUsuario, idEsp]
                );
            }
        }

        return idUsuario;
    }

    // ALTERAR STATUS
    static async alterarStatus(id) {

        const buscarQuery = `
            SELECT ativo
            FROM usuario
            WHERE id_usuario = ?
        `;

        const [usuario] = await db.promise().query(
            buscarQuery,
            [id]
        );

        if (!usuario.length) {
            throw new Error('Utilizador não encontrado');
        }

        const novoStatus = usuario[0].ativo ? 0 : 1;

        const updateQuery = `
            UPDATE usuario
            SET ativo = ?
            WHERE id_usuario = ?
        `;

        await db.promise().query(
            updateQuery,
            [novoStatus, id]
        );

        return novoStatus;
    }

    // APAGAR PROFISSIONAL
    static async apagarProfissional(id) {

        const query = `
            DELETE FROM usuario
            WHERE id_usuario = ?
        `;

        await db.promise().query(query, [id]);

        return true;
    }
}

module.exports = ProfissionalModel;