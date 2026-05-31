import { Imagen } from '../model/Imagen.js';
import { Publicacion } from '../model/Publicacion.js';
import { Comentario } from '../model/Comentario.js';
import { Usuario } from '../model/Usuario.js';
import { Valoracion } from '../model/Valoracion.js';
import { Etiqueta } from '../model/Etiqueta.js';
import sequelize  from '../db/config.js';

export async function mostrarPublicacion(req, res) {
    try {
        const publicaciones = await Publicacion.findAll({
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
            }]
        });

        // Calcular promedio para cada imagen
        for (const pub of publicaciones) {
            for (const img of pub.Imagens) {
                const promedio = await Valoracion.findAll({
                attributes: [
                    [sequelize.fn('AVG', sequelize.col('puntaje')), 'promedio']
                ],
                where: { id_imagen: img.id_imagen },
                raw: true
                });

                img.dataValues.promedio = promedio[0].promedio 
                ? parseInt(promedio[0].promedio) 
                : null;
        console.log('Promedio crudo:', promedio);
            }
        
        }
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
                        promedio: imagen.dataValues.promedio || null
                    });
                } else {
                    console.log(`    Imagen inválida:`, imagen);
                }
            }
            
            publicacionesProcesadas.push({
                id: pub.id_publicacion,
                titulo: pub.titulo,
                descripcion: pub.descripcion,
                imagenes: imagenesProcesadas,
                etiquetas: (pub.Etiqueta || []).map(e => e.nombre)
            });
        }
        
        console.log('Primera publicación:', JSON.stringify(publicacionesProcesadas[0], null, 2));

        res.render('publicacion/gallery', {
            publicaciones: publicacionesProcesadas
        });
        
    } catch(error) {
        console.error(error);
        res.status(500).send('Error al cargar la galería');
    }
}

//NOTA: Lo que generaba que no se subieran las imagenes es que se
//rompia silenciosamente en las etiquetas
export async function subirPublicacion(req, res) {
    try {
        //Crea y guarda la publicacion
        const pub = await Publicacion.crearPublicacion({
            estado: "Sin denuncias",
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            id_usuario: 1
        });

        //Etiquetas
        /* if(etiquetas && etiquetas.length > 0) {
            for(const nombre of etiquetas) {
                if(nombre.trim() !== "") {
                    const [etiqueta] = await Etiqueta.findOrCreate({ where: { nombre } });
                    await pub.addEtiqueta(etiqueta);
                }
            }
        } */

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
            const resultado = await Imagen.crearImagen(imagenCreada);
            console.log('Imagen guardada con ID:', resultado?.id_imagen);
        }

        res.redirect('publicacion/gallery')
    } catch (error) {
        res.status(500).send('Error al crear la publicación');
    }
}


export async function subirComentario(req, res) {

    try {
    //NOTA: const sin uso
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


