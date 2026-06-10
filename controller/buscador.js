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
            where: { 
                [Op.or]: [
                    {titulo: { [Op.like]: `%${busqueda}%` } },
                    sequelize.where(
                        sequelize.fn('concat', sequelize.col('Usuario.firstName'), ' ', sequelize.col('Usuario.lastName')),
                        { [Op.like]: `%${busqueda}%` }
                    ),
                    { '$Usuario.firstName$': { [Op.like]: `%${busqueda}%` } },
                    { '$Usuario.lastName$': { [Op.like]: `%${busqueda}%` } },
                    { '$Etiquetas.etiqueta$': { [Op.iLike]: `%${busqueda}%` } }
                ]
            },
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
                as: 'Etiquetas',
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
        console.error('[!] Error al buscar:', error);
        res.status(500).send('Error al cargar las publicaciones buscadas');
    }
}