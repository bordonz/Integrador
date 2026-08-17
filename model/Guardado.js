import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config.js";

export class Guardado extends Model {
    static async crearGuardado(atributo) {
        return await Guardado.create(atributo);
    }
}

Guardado.init(
    {
        id_guardado: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
    },
    {
        //Other model options go here
        sequelize, //We need to pass the connection instance
        modelName: 'Guardado', //We need to choose the model name
        tableName: 'guardado',
        createdAt: true,
        deletedAt: true,
        updatedAt: false,
    }
)