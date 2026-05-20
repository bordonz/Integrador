import { Model, DataTypes } from "sequelize";
import sequelize from "../db/config.js";

export class Denuncia extends Model {}

Denuncia.init(
    {
        //Model attributes
        id_denuncia: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        estado: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        titulo: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.STRING(50),
        },
    },
    {
        //Other model options go here
        sequelize, //We need to pass the connection instance
        modelName: 'Denuncia', //We need to choose the model name
        tableName: 'denuncia',
        createdAt: true,
        deletedAt: true,
        updatedAt: false,
    },
);