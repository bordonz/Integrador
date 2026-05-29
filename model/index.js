import sequelize from "../db/config.js";
import { Usuario } from "./Usuario.js";
import { Etiqueta } from "./Etiqueta.js";
import { Publicacion } from "./Publicacion.js";
import { Comentario } from "./Comentario.js";
import { Imagen } from "./Imagen.js";
import { Valoracion } from "./Valoracion.js";
import { Denuncia } from "./Denuncia.js";

// etiqueta y publicacion con tabla intermedia
Publicacion.belongsToMany(Etiqueta, {through: 'etiqueta_pub', foreignKey: 'id_publicacion'});
Etiqueta.belongsToMany(Publicacion, {through: 'etiqueta_pub', foreignKey: 'id_etiqueta'});

// publicacion y usuario (1:n)
Usuario.hasMany(Publicacion, {foreignKey: 'id_usuario'});
Publicacion.belongsTo(Usuario, {foreignKey: 'id_usuario'});

// imagen y comentario (1:n)
Imagen.hasMany(Comentario, {foreignKey: 'id_imagen'});
Comentario.belongsTo(Imagen, {foreignKey: 'id_imagen'});

// comentario y usuario (1:n)
Usuario.hasMany(Comentario, { foreignKey: 'id_usuario' });
Comentario.belongsTo(Usuario, { foreignKey: 'id_usuario' });

// denuncia y comentario/publicacion (1:n)
Comentario.hasMany(Denuncia, {foreignKey: 'id_comentario'});
/* Denuncia.belongsTo(Comentario, { foreignKey: 'id_comentario' }); */
Denuncia.belongsTo(Comentario, { foreignKey: { name: 'id_comentario', allowNull: true } });

Publicacion.hasMany(Denuncia, {foreignKey: 'id_publicacion'});
/* Denuncia.belongsTo(Publicacion, { foreignKey: 'id_publicacion' }); */
Denuncia.belongsTo(Publicacion, { foreignKey: { name: 'id_publicacion', allowNull: true } });

//imagen y publicacion/valoracion (1:n)
Publicacion.hasMany(Imagen, {foreignKey: 'id_publicacion'});
Imagen.belongsTo(Publicacion, {foreignKey: 'id_publicacion'});

Imagen.hasMany(Valoracion, {foreignKey: 'id_imagen'});
Valoracion.belongsTo(Imagen, {foreignKey: 'id_imagen'});

//valoracion y usuario (1:n)
Usuario.hasMany(Valoracion, {foreignKey: 'id_usuario'});
Valoracion.belongsTo(Usuario, {foreignKey: 'id_usuario'});

// usuario y usuario con tabla intermedia
Usuario.belongsToMany(Usuario, {as: 'seguidos', through: 'seguir', foreignKey: 'id_seguidor'});
Usuario.belongsToMany(Usuario, {as: 'seguidores', through: 'seguir', foreignKey: 'id_seguido'});


export async function connectDatabase() {
  try {
    await sequelize.authenticate(); // testear la conexion
    console.log('[+] Conexion a bd establecida')

    await sequelize.sync({ alter: true });
    console.log('[+] Sincronizado de modelos')
  } catch (error) {
    console.error('[+] Error en la conexion a la bd', error)
    throw error
  }
}