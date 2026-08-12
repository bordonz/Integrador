import { Imagen } from '../model/Imagen.js';
import { Publicacion } from '../model/Publicacion.js';
import { Comentario } from '../model/Comentario.js';
import { Usuario } from '../model/Usuario.js';
import { Valoracion } from '../model/Valoracion.js';
import { Etiqueta } from '../model/Etiqueta.js';
import sequelize  from '../db/config.js';
import { procesarPublicaciones } from '../helpers/procesarPubs.js';
import { Denuncia } from '../model/Denuncia.js';

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

export async function cerrarComentarios(req, res) {
  try {
    const imagen = await Imagen.findByPk(req.params.idImagen);
    
    if (!imagen) return res.status(404).send('Imagen no encontrada');

    imagen.estado = Boolean(!imagen.estado);
    console.log('ESTADO DE LOS COMENTARIOS',imagen.estado)
    await imagen.save();

    res.redirect('/galeria')
  } catch (error) {
    console.error('[!] Error al alternar comentarios:', error);
    res.status(500).send('Error al actualizar estado de comentarios');
  }
}

export async function denunciarImagen(req, res) {
  try {
    const denuncia = {
      estado: "pendiente",
      titulo: req.body.valor,
      descripcion: req.body.descripcion,
      id_comentario: null,
      id_imagen: req.body.idImagen,
      id_usuario: req.session.usuario.id
    };
    
    await Denuncia.crearDenuncia(denuncia);
    res.redirect('/galeria');
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al registrar la denuncia");
  }
}
