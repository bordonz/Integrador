import { Imagen } from '../model/Imagen.js';
import { Publicacion } from '../model/Publicacion.js';
import { Comentario } from '../model/Comentario.js';
import { Usuario } from '../model/Usuario.js';
import { Valoracion } from '../model/Valoracion.js';
import { Etiqueta } from '../model/Etiqueta.js';
import sequelize  from '../db/config.js';
import { Op } from 'sequelize';
import { procesarPublicaciones } from '../helpers/procesarPubs.js';

export async function buscar(req, res) {
    try {
        const busqueda = req.query.buscar;
        const publicaciones = await Publicacion.findAll({
            where: { titulo: { [Op.like]: `%${busqueda}%` } },
            include: [{
                model: Imagen,
                include: [{
                    model: Comentario,
                    include: [ Usuario ]
                    }
                ]
                },
            {
                model: Etiqueta,
                through: { attributes: [] }
            },
            {
                model: Usuario,
                attributes: ['id_usuario', 'firstName', 'lastName']
            }]
        });
        const publicacionesProcesadas = await procesarPublicaciones(publicaciones);
        res.render('publicacion/gallery', { publicaciones: publicacionesProcesadas });
    } catch (error) {
        res.status(500).send('Error al cargar las publicaciones buscadas');
    }
}