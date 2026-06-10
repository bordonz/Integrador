import { Model, DataTypes } from "sequelize";
import sequelize from "../db/config.js";

export class Comentario extends Model {
    static async subirComentario(atributo) {
        return await Comentario.create(atributo);
    }
}

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
        id_imagen: {
            type: DataTypes.INTEGER,
            references: {
                model: "imagen", // 🔎 nombre exacto de la tabla
                key: "id_imagen",
            },
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            references: {
                model: "usuario",
                key: "id_usuario",
            }
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