import { Model, DataTypes } from "sequelize";
import sequelize from "../db/config.js";

export class Publicacion extends Model {
    static async crearPublicacion(atributos) {
        return await Publicacion.create(atributos);
    }
}

Publicacion.init(
    {
        //Model attributes
        id_publicacion: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        estado: {
            type: DataTypes.STRING(50),
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
        modelName: 'Publicacion', //We need to choose the model name
        tableName: 'publicacion',
        createdAt: true,
        deletedAt: true,
        updatedAt: false,
    },
);