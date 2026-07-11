const { promisePool } = require('../config/db');
const iotService = require('../services/iotService');

exports.receberLeitura =
    async (req, res) => {

        try {

            await iotService.salvar(req.body);

            res.status(201).json({
                success: true,
                message: 'Leitura guardada.'
            });

        } catch (err) {

            console.error(err);

            res.status(500).json({
                success: false,
                message: err.message
            });

        }

    };

exports.obterUltimaLeitura =
    async (req, res) => {

        try {

            const dados =
                await iotService.obterUltimaLeitura(
                    req.params.idWearable
                );

            res.json(dados);

        } catch (err) {

            console.error(err);

            res.status(500).json({
                success: false
            });

        }

    };

exports.minhasLeituras =
    async (req, res) => {

        try {

            const dados =
                await iotService.obterUltimaLeitura(
                    1
                );

            res.json(dados);

        }
        catch (err) {

            console.log(err);

            res.status(500).json({
                success: false
            });

        }

    };

// exports.historico =
//     async (req, res) => {

//         try {

//             const dados =
//                 await iotService.obterHistorico(
//                     3
//                 );

//             res.json(dados);

//         }
//         catch (err) {

//             console.log(err);

//             res.status(500).json({
//                 success: false
//             });

//         }

//     };

exports.historico = async (req, res) => {

    try {

        const [dados] = await db.query(`
            SELECT *
            FROM leitura_sensor
            WHERE id_wearable = 1
            ORDER BY data_hora DESC
            LIMIT 30
        `);

        res.json(dados);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            erro: true
        });

    }

};

exports.ultimaLeitura = async (req, res) => {
    try {

        const [dados] =
            await promisePool.query(`
                SELECT *
                FROM leitura_sensor ls
                WHERE ls.id_leitura IN (
                    SELECT MAX(id_leitura)
                    FROM leitura_sensor
                    WHERE id_wearable = 1
                    GROUP BY id_sensor
                )
            `);

        res.json(dados);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            erro: true,
            mensagem: err.message
        });

    }
};