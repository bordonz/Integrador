import { Model, DataTypes } from "sequelize";
import sequelize from "../db/config.js";

export class Valoracion extends Model {}

Valoracion.init(
    {
        //Model attributes
        puntaje: {
            type: DataTypes.INTEGER,
        },
    },
    {
        //Other model options go here
        sequelize, //We need to pass the connection instance
        modelName: 'Valoracion', //We need to choose the model name
        tableName: 'valoracion',
        createdAt: true,
        deletedAt: true,
        updatedAt: false,
    },
);