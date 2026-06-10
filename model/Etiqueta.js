import { Model, DataTypes } from "sequelize";
import sequelize from "../db/config.js";

export class Etiqueta extends Model {}

Etiqueta.init(
    {
        //Model attributes
        id_etiqueta: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        etiqueta: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
    },
    {
        //Other model options go here
        sequelize, //We need to pass the connection instance
        modelName: 'Etiqueta', //We need to choose the model name
        tableName: 'etiqueta',
        createdAt: true,
        deletedAt: true,
        updatedAt: false,
    },
);