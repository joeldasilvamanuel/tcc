const { promisePool: db } = require('../config/db');

class ChatService {

    static async obterConversaEntreUtilizadores(idUser1, idUser2) {

        const [rows] = await db.query(`
            SELECT c.id_conversa
            FROM conversa c
            INNER JOIN conversa_participante cp1
                ON c.id_conversa = cp1.id_conversa
            INNER JOIN conversa_participante cp2
                ON c.id_conversa = cp2.id_conversa
            WHERE cp1.id_usuario = ?
              AND cp2.id_usuario = ?
            LIMIT 1
        `, [idUser1, idUser2]);

        return rows[0] || null;
    }

    static async criarConversaSeNaoExistir(idRemetente, idDestinatario) {

        let conversa = await this.obterConversaEntreUtilizadores(
            idRemetente,
            idDestinatario
        );

        if (conversa) {
            return conversa.id_conversa;
        }

        const [novaConversa] = await db.query(`
            INSERT INTO conversa (data_inicio)
            VALUES (NOW())
        `);

        const idConversa = novaConversa.insertId;

        await db.query(`
            INSERT INTO conversa_participante
            (id_conversa, id_usuario)
            VALUES (?, ?), (?, ?)
        `, [
            idConversa,
            idRemetente,
            idConversa,
            idDestinatario
        ]);

        return idConversa;
    }

    static async guardarMensagem(
        idConversa,
        idRemetente,
        idDestinatario,
        conteudo
    ) {

        const [result] = await db.query(`
        INSERT INTO mensagem (
            id_conversa,
            id_remetente,
            id_destinatario,
            conteudo
        )
        VALUES (?, ?, ?, ?)
    `, [
            idConversa,
            idRemetente,
            idDestinatario,
            conteudo
        ]);

        const [rows] = await db.query(`
        SELECT *
        FROM mensagem
        WHERE id_mensagem = ?
    `, [result.insertId]);

        return rows[0];
    }

    static async listarMensagens(idConversa) {

        const [rows] = await db.query(`
            SELECT *
            FROM mensagem
            WHERE id_conversa = ?
            ORDER BY data_envio ASC
        `, [idConversa]);

        return rows;
    }

    static async listarConversasPorUtilizador(idUsuario) {

        const [rows] = await db.query(`
        SELECT

            c.id_conversa,
            c.data_inicio,

            u.id_usuario AS id_outro_utilizador,
            u.nome AS nome_outro_utilizador,
            u.tipo_usuario,

            (
                SELECT conteudo
                FROM mensagem m
                WHERE m.id_conversa = c.id_conversa
                ORDER BY m.data_envio DESC
                LIMIT 1
            ) AS ultima_mensagem,

            (
                SELECT data_envio
                FROM mensagem m
                WHERE m.id_conversa = c.id_conversa
                ORDER BY m.data_envio DESC
                LIMIT 1
            ) AS ultima_data

        FROM conversa c

        INNER JOIN conversa_participante cp1
            ON cp1.id_conversa = c.id_conversa

        INNER JOIN conversa_participante cp2
            ON cp2.id_conversa = c.id_conversa
            AND cp2.id_usuario <> cp1.id_usuario

        INNER JOIN usuario u
            ON u.id_usuario = cp2.id_usuario

        WHERE cp1.id_usuario = ?

        ORDER BY ultima_data DESC

    `, [idUsuario]);

        return rows;
    }

    static async obterIdUtentePorUsuario(idUsuario) {

        const [rows] = await db.query(`
        SELECT id_utente
        FROM utente
        WHERE id_usuario = ?
        LIMIT 1
    `, [idUsuario]);

        return rows.length ? rows[0].id_utente : null;
    }

    static async criarNotificacao(
        idUsuario,
        mensagem,
        idTipoAlerta = 1
    ) {

        const idUtente =
            await this.obterIdUtentePorUsuario(
                idUsuario
            );

        if (!idUtente) {
            console.log(
                `Utilizador ${idUsuario} não possui registo na tabela utente`
            );
            return;
        }

        await db.query(`
        INSERT INTO alerta (
            id_utente,
            mensagem,
            lido,
            data_hora,
            id_tipo_alerta,
            estado
        )
        VALUES (
            ?, ?, 0, NOW(), ?, 'ativo'
        )
    `, [
            idUtente,
            mensagem,
            idTipoAlerta
        ]);
    }

    static async marcarComoLida(idMensagem) {

        await db.query(`
            UPDATE mensagem
            SET lida = 1
            WHERE id_mensagem = ?
        `, [idMensagem]);
    }

    static async listarProfissionais() {

        const [rows] = await db.query(`
        SELECT
            id_usuario,
            nome,
            tipo_usuario
        FROM usuario
        WHERE tipo_usuario IN (
            'medico',
            'enfermeiro',
            'recepcionista'
        )
        ORDER BY nome ASC
    `);

        return rows;
    }

    static async obterConversaPorUtilizadores(
        idUser1,
        idUser2
    ) {

        const conversa =
            await this.obterConversaEntreUtilizadores(
                idUser1,
                idUser2
            );

        if (!conversa) {
            return null;
        }

        const mensagens =
            await this.listarMensagens(
                conversa.id_conversa
            );

        return {
            id_conversa:
                conversa.id_conversa,
            mensagens
        };
    }
}

module.exports = ChatService;