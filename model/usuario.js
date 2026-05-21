import { Model, DataTypes } from "sequelize";
import sequelize from "../db/config.js";

export class Usuario extends Model {
    static async crearUsuario(atributos) {
        return await Usuario.create(atributos);
    }

    static async getUsuario() {
        
    }
}

Usuario.init(
    {
        //Model attributes
        id_usuario: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING(50),
        },
        lastName: {
            type: DataTypes.STRING(50),
            //allowNull: default to true
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
    },
    {
        //Other model options go here
        sequelize, //We need to pass the connection instance
        modelName: 'Usuario', //We need to choose the model name
        tableName: 'usuario',
        createdAt: true,
        deletedAt: true,
        updatedAt: false,
    },
);
