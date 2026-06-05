import { Model, DataTypes } from "sequelize";
import sequelize from "../db/config.js";

export class Seguir extends Model {}

Seguir.init(
    {
        //Model attributes
        id_seguidor: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        id_seguido: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        }
    },
    {
        //Other model options go here
        sequelize, //We need to pass the connection instance
        modelName: 'Seguir', //We need to choose the model name
        tableName: 'seguir',
        timestamps: true,   // crea createdAt y updatedAt
        paranoid: true      // crea deletedAt y activa soft delete
    },
);
