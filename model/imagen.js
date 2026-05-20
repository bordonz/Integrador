import { Model, DataTypes } from "sequelize";
import sequelize from "../db/config.js";

export class Imagen extends Model {}

Imagen.init(
    {
        //Model attributes
        id_imagen: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
    },
    {
        //Other model options go here
        sequelize, //We need to pass the connection instance
        modelName: 'Imagen', //We need to choose the model name
        tableName: 'imagen',
        createdAt: true,
        deletedAt: true,
        updatedAt: false,
    },
);