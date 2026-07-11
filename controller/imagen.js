import { Imagen } from '../model/Imagen.js';
import { Publicacion } from '../model/Publicacion.js';
import { Comentario } from '../model/Comentario.js';
import { Usuario } from '../model/Usuario.js';
import { Valoracion } from '../model/Valoracion.js';
import { Etiqueta } from '../model/Etiqueta.js';
import sequelize  from '../db/config.js';
import { procesarPublicaciones } from '../helpers/procesarPubs.js';

export async function mostrarPublicacion(req, res) {
  try {
    const publicaciones = await Publicacion.findAll({
      include: [
        {
          model: Imagen,
          include: [{
            model: Comentario,
            include: [ Usuario ]
          }]
        },
        {
          model: Etiqueta,
          as: 'Etiquetas',
          through: { attributes: [] }
        },
        {
          model: Usuario,
          attributes: ['id_usuario', 'firstName', 'lastName']
        }
      ]
    });
    const publicacionesProcesadas = await procesarPublicaciones(publicaciones);
    res.render('publicacion/gallery', { publicaciones: publicacionesProcesadas });
  } catch (error) {
    res.status(500).send('Error al cargar la galería');
  }
}
