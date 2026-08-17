import { Coleccion } from "../model/Coleccion.js";
import { Guardado } from "../model/Guardado.js";
import { Publicacion } from "../model/Publicacion.js";
import { Imagen } from "../model/Imagen.js";
import { Etiqueta } from "../model/Etiqueta.js";
import { Comentario } from "../model/Comentario.js";
import { Usuario } from "../model/Usuario.js";
import { procesarPublicaciones } from "../helpers/procesarPubs.js";

export async function mostrarGuardados(req, res) {
    try {
        const idUsuario = req.session.usuario.id;
        const guardados = await Guardado.findAll({
            where: { id_usuario: idUsuario },
            include: [
                {
                    model: Publicacion,
                    include: [{
                        model: Imagen,
                        include: [{
                            model: Comentario,
                            include: [ Usuario ]
                    }]
                }
                ,
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
                },
                {
                model: Coleccion,
                attributes: ['id_coleccion', 'nombre']
                }
            ]
        });

        const publicaciones = guardados.map(g => g.Publicacion);
        const publicacionesProcesadas = await procesarPublicaciones(publicaciones);

        res.render('usuario/guardado', { usuario: req.session.usuario, publicaciones: publicacionesProcesadas });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar los guardados');
    }
}

export async function guardarPub(req, res) {
    try {
        const guardado = {
            id_usuario: req.session.usuario.id,
            id_publicacion: req.body.idPublicacion,
            id_coleccion: req.body.id_coleccion
        }

        await Guardado.create(guardado);
        res.redirect('/galeria');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al guardar la publicacion");
    }
}

export async function obtenerColecciones(req, res) {
    try {
        const colecciones = await Coleccion.findAll({
            where: { id_usuario: req.session.usuario.id },
            attributes: ['id_coleccion', 'nombre']
        });
        console.log(colecciones)
        res.render('galleryPartial', { colecciones });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al crear la colección");
    }
}

export async function crearColeccion(req, res) {
    try {
        const coleccion = {
            nombre: req.body.nombre,
            id_usuario: req.session.usuario.id
        };

        await Coleccion.create(coleccion)

        res.render('usuario/guardado');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al crear la colección");
    }
}