import sequelize from "../db/config.js";
import { Usuario } from "./Usuario.js";
import { Etiqueta } from "./Etiqueta.js";
import { Publicacion } from "./Publicacion.js"; 
import { Comentario } from "./Comentario.js";
import { Imagen } from "./Imagen.js";
import { Valoracion } from "./Valoracion.js";
import { Denuncia } from "./Denuncia.js";
import { Seguir } from "./Seguir.js";
import { Guardado } from "./Guardado.js";
import { Coleccion } from "./Coleccion.js";

let associationsInitialized = false;

export function initializeAssociations() {
  if (associationsInitialized) {
    return;
  }
}

// etiqueta y publicacion con tabla intermedia
Publicacion.belongsToMany(Etiqueta, {through: 'etiqueta_pub', foreignKey: 'id_publicacion', as: 'Etiquetas'});
Etiqueta.belongsToMany(Publicacion, {through: 'etiqueta_pub', foreignKey: 'id_etiqueta', as: 'Publicaciones'});

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
Denuncia.belongsTo(Comentario, { foreignKey: { name: 'id_comentario', allowNull: true } });

Imagen.hasMany(Denuncia, {foreignKey: 'id_imagen'});
Denuncia.belongsTo(Imagen, { foreignKey: { name: 'id_imagen', allowNull: true } });

Usuario.hasMany(Denuncia, { foreignKey: 'id_usuario' });
Denuncia.belongsTo(Usuario, { foreignKey: { name: 'id_usuario', allowNull: false } });

//imagen y publicacion/valoracion (1:n)
Publicacion.hasMany(Imagen, {foreignKey: 'id_publicacion'});
Imagen.belongsTo(Publicacion, {foreignKey: 'id_publicacion'});

Imagen.hasMany(Valoracion, {foreignKey: 'id_imagen'});
Valoracion.belongsTo(Imagen, {foreignKey: 'id_imagen'});

//valoracion y usuario (1:n)
Usuario.hasMany(Valoracion, {foreignKey: 'id_usuario'});
Valoracion.belongsTo(Usuario, {foreignKey: 'id_usuario'});

// usuario y usuario con tabla intermedia
Usuario.belongsToMany(Usuario, {as: 'Seguidos', through: Seguir, foreignKey: 'id_seguidor',
  otherKey: 'id_seguido'});
Usuario.belongsToMany(Usuario, {as: 'Seguidores', through: Seguir, foreignKey: 'id_seguido',
  otherKey: 'id_seguidor'});

// Guardado ↔ Usuario
Usuario.hasMany(Guardado, { foreignKey: 'id_usuario' });
Guardado.belongsTo(Usuario, { foreignKey: 'id_usuario' });

// Guardado ↔ Publicacion
Publicacion.hasMany(Guardado, { foreignKey: 'id_publicacion' });
Guardado.belongsTo(Publicacion, { foreignKey: 'id_publicacion' });

// Guardado ↔ Coleccion
Coleccion.hasMany(Guardado, { foreignKey: 'id_coleccion' });
Guardado.belongsTo(Coleccion, { foreignKey: 'id_coleccion' });

// Usuario ↔ Coleccion
Usuario.hasMany(Coleccion, { foreignKey: 'id_usuario' });
Coleccion.belongsTo(Usuario, { foreignKey: 'id_usuario' });


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