const { connection: db } = require('../config/db');

exports.salvarLeituras =
    async (dados) => {

        const {
            device_id,
            temperatura,
            status_temperatura,
            bpm,
            status_bpm,
            spo2,
            status_spo2
        } = dados;

        return new Promise((resolve, reject) => {

            const sql = `
        INSERT INTO leitura_sensor
        (
            id_wearable,
            id_sensor,
            valor,
            estado,
            origem
        )
        VALUES ?
        `;

            const valores = [

                [
                    device_id,
                    1,
                    temperatura,
                    status_temperatura,
                    'automatico'
                ],

                [
                    device_id,
                    2,
                    bpm,
                    status_bpm,
                    'automatico'
                ],

                [
                    device_id,
                    3,
                    spo2,
                    status_spo2,
                    'automatico'
                ]
            ];

            db.query(
                sql,
                [valores],
                (err, result) => {

                    if (err)
                        return reject(err);

                    resolve(result);

                }
            );

        });

    };

exports.obterUltimaLeitura =
    (idWearable) => {

        return new Promise(
            (resolve, reject) => {

                const sql = `
            SELECT
                id_sensor,
                valor,
                estado,
                data_hora
            FROM leitura_sensor
            WHERE id_wearable = ?
            ORDER BY id_leitura DESC
            LIMIT 3
        `;

                db.query(
                    sql,
                    [idWearable],
                    (err, result) => {

                        if (err)
                            return reject(err);

                        resolve(result);

                    }
                );

            });

    };

exports.minhasLeituras =
    (userId) => {

        return new Promise(
            (resolve, reject) => {

                const sql = `
        SELECT
            ls.id_sensor,
            ls.valor,
            ls.estado,
            ls.data_hora
        FROM leitura_sensor ls
        INNER JOIN wearable w
            ON w.id_wearable =
               ls.id_wearable
        INNER JOIN utente u
            ON u.id_utente =
               w.id_utente
        WHERE u.id_usuario = ?
        ORDER BY ls.id_leitura DESC
        LIMIT 3
        `;

                db.query(
                    sql,
                    [userId],
                    (err, result) => {

                        if (err)
                            return reject(err);

                        resolve(result);

                    }
                );

            });

    };

exports.obterHistorico =
    (idUsuario) => {

        return new Promise(
            (resolve, reject) => {

                const sql = `
        SELECT
            ls.valor,
            ls.estado,
            ls.data_hora,
            ls.id_sensor
        FROM leitura_sensor ls
        INNER JOIN wearable w
            ON w.id_wearable =
               ls.id_wearable
        INNER JOIN utente u
            ON u.id_utente =
               w.id_utente
        WHERE
            u.id_usuario = ?
        ORDER BY
            ls.data_hora DESC
        LIMIT 30
        `;

                db.query(
                    sql,
                    [idUsuario],
                    (err, result) => {

                        if (err)
                            return reject(err);

                        resolve(result);

                    }
                );

            });

    };