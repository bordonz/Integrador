import { Model, DataTypes } from "sequelize";
import sequelize from "../db/config.js";

export class Coleccion extends Model {

}

Coleccion.init(
    {
        id_coleccion: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },    
    },
    {
        sequelize, //We need to pass the connection instance
        modelName: 'Coleccion', //We need to choose the model name
        tableName: 'coleccion',
        createdAt: true,
        deletedAt: true,
        updatedAt: false,
    }
)