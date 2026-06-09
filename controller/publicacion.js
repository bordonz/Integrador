import { Imagen } from '../model/Imagen.js';
import { Publicacion } from '../model/Publicacion.js';
import { Comentario } from '../model/Comentario.js';
import { Usuario } from '../model/Usuario.js';
import { Valoracion } from '../model/Valoracion.js';
import { Etiqueta } from '../model/Etiqueta.js';
import sequelize  from '../db/config.js';

//NOTA: Lo que generaba que no se subieran las imagenes es que se
//rompia silenciosamente en las etiquetas
export async function subirPublicacion(req, res) {
    try {
        //Crea y guarda la publicacion
        const pub = await Publicacion.crearPublicacion({
            estado: "Sin denuncias",
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            id_usuario: req.session.usuario.id
        });

    const imagenes = req.body.imgs;
    
        for(const img of imagenes) {
            if (!img?.src) {
                console.warn('Imagen sin src:', img);
                continue;
            }
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

        // Etiquetas
        const etiquetasRaw = req.body.etiquetas;
        const etiquetas = Array.isArray(etiquetasRaw) ? etiquetasRaw : (etiquetasRaw ? [etiquetasRaw] : []);

        if (etiquetas.length > 0) {
            for (const nombre of etiquetas) {
                if (nombre.trim() !== "") {
                    const [etiqueta] = await Etiqueta.findOrCreate({ where: { etiqueta: nombre } });
                    await pub.addEtiqueta(etiqueta);
                }
            }
        }
 
        res.redirect('publicacion/gallery')
    } catch (error) {
        console.error('Error detallado:', error);
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
            id_usuario: req.session.usuario.id
        });

        res.redirect('/galeria');
    }catch(error) {
        console.error(error);
        res.status(500).send('Error al subir el comentario');
    }
}


