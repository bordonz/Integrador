import { Model, DataTypes } from "sequelize";
import sequelize from "../db/config.js";

export class Valoracion extends Model {
  static async existeValoracion(idImagen, idUsuario) {
    return await Valoracion.findOne({
      where: { id_usuario: idUsuario, id_imagen: idImagen }
    });
  }
    static async crearValoracion({valor, idImagen, idUsuario}) {
        const existe = await Valoracion.existeValoracion(idImagen, idUsuario);
        
        if(existe) {
            throw new Error('Ya existe una valoración de este usuario para esta imagen');
        }
        return await Valoracion.create({
            puntaje: valor,
            id_imagen: idImagen,
            id_usuario: idUsuario,
        });
    }
}

Valoracion.init(
    {
        //Model attributes
        puntaje: {
            type: DataTypes.INTEGER,
        },
        id_imagen: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false
    }
    },
    {
        //Other model options go here
        sequelize, //We need to pass the connection instance
        modelName: 'Valoracion', //We need to choose the model name
        tableName: 'valoracion',
        createdAt: true,
        deletedAt: true,
        updatedAt: false,
    },
);