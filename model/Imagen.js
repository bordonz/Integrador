import { Model, DataTypes } from "sequelize";
import sequelize from "../db/config.js";

export class Imagen extends Model {
    static async crearImagen(atributos) {
        return await Imagen.create(atributos);
    }
}
    
Imagen.init(
    {
        //Model attributes
        id_imagen: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false, // nombre del archivo
        },
        contenido: {
            type: DataTypes.BLOB("long"), // binario de la imagen
            allowNull: false,
        },
        estado: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        metadata: {
            type: DataTypes.STRING, // ej: "image/png", "image/jpeg"
            allowNull: false,
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
