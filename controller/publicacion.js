import { Imagen } from '../model/Imagen.js';
import { Publicacion } from '../model/Publicacion.js';
import { Comentario } from '../model/Comentario.js';
import { Usuario } from '../model/Usuario.js';

export async function mostrarPublicacion(req, res) {
    try {
        const publicaciones = await Publicacion.findAll({
            include: [{
                model: Imagen,
                include: [{
                    model: Comentario,
                    include: [ Usuario ]
                    }]
                }]
        });

        const publicacionesProcesadas = [];
        
        for(const pub of publicaciones) {
            const imagenesProcesadas = [];
            
            console.log(`Publicación ${pub.id_publicacion}: ${pub.titulo}`);
            console.log(`  Número de imágenes: ${pub.Imagens?.length || 0}`);
            
            const imagenes = pub.Imagens || [];
            
            for(const imagen of imagenes) {
                if (imagen && imagen.contenido && imagen.nombre) {
                    const imgsBase64 = imagen.contenido.toString('base64');
                    const sufix = `data:image/${imagen.metadata};base64,`;
                    
                    //Comentarios asociados a la imagen
                    const comentarios = (imagen.Comentarios || []).map(c => ({
                        id: c.id_comentario,
                        texto: c.descripcion,
                        autor: c.Usuario ? `${c.Usuario.firstName}` : 'Usuario',
                        fecha: c.createdAt ? c.createdAt.toLocaleString() : ''
                    }));

                    imagenesProcesadas.push({
                        id: imagen.id_imagen,
                        name: imagen.nombre,
                        src: sufix + imgsBase64,
                        descripcion: imagen.descripcion || '',
                        comentarios: comentarios,
                    });
                    console.log(`    Imagen procesada: ${imagen.nombre}`);
                } else {
                    console.log(`    Imagen inválida:`, imagen);
                }
            }
            
            publicacionesProcesadas.push({
                id: pub.id_publicacion,
                titulo: pub.titulo,
                descripcion: pub.descripcion,
                imagenes: imagenesProcesadas
            });
        }
        
        console.log('Total publicaciones procesadas:', publicacionesProcesadas.length);
        console.log('Primera publicación:', JSON.stringify(publicacionesProcesadas[0], null, 2));
        
        res.render('publicacion/gallery', {
            publicaciones: publicacionesProcesadas
        });
        
    } catch(error) {
        console.error(error);
        res.status(500).send('Error al cargar la galería');
    }
}

export async function subirPublicacion(req, res) {
    //Crea y guarda la publicacion
    const pub = await Publicacion.crearPublicacion({
        estado: "Sin denuncias",
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        id_usuario: 1
    });

    const imagenes = req.body.imgs;

    for(const img of imagenes) {
        const textBase64 = img.src;

        const arregloBase64 = textBase64.split(',');
        const imgBuffer = Buffer.from(arregloBase64[1], 'base64')

        const imagenCreada = {
            contenido: imgBuffer,
            nombre: img.name,
            id_publicacion: pub.id_publicacion,
            metadata: arregloBase64[0]
        };
        await Imagen.crearImagen(imagenCreada);
    }

    res.redirect('publicacion/gallery')
}

export async function subirComentario(req, res) {

    try {
        const com = await Comentario.subirComentario({
            descripcion: req.body.descripcion,
            estado: "Sin denuncias",
            id_imagen: req.params.idImagen,
            id_usuario: 1
        });

        res.redirect('/publicacion/gallery');
    }catch(error) {
        console.error(error);
        res.status(500).send('Error al subir el comentario');
    }
}


