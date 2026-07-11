const iotModel = require('../models/iotModel');

exports.salvar = async (dados) => {

    await iotModel.salvarLeituras(dados);

};

exports.obterUltimaLeitura =
    async (idWearable) => {

        return await
            iotModel.obterUltimaLeitura(
                idWearable
            );

    };

exports.minhasLeituras =
    async (userId) => {

        return await
            iotModel.minhasLeituras(
                userId
            );

    };

exports.obterHistorico =
    async (idUsuario) => {

        return await iotModel
            .obterHistorico(
                idUsuario
            );

    };