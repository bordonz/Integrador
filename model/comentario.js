import { Model, DataTypes } from "sequelize";
import sequelize from "../db/config.js";

export class Comentario extends Model {}

Comentario.init(
    {
        //Model attributes
        id_comentario: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        descripcion: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        estado: {
            type: DataTypes.STRING(50),
        },
    },
    {
        //Other model options go here
        sequelize, //We need to pass the connection instance
        modelName: 'Comentario', //We need to choose the model name
        tableName: 'comentario',
        createdAt: true,
        deletedAt: true,
        updatedAt: false,
    },
);