import { Imagen } from '../model/Imagen.js';
import { Publicacion } from '../model/Publicacion.js';
import { Comentario } from '../model/Comentario.js';
import { Usuario } from '../model/Usuario.js';
import { Valoracion } from '../model/Valoracion.js';
import { Etiqueta } from '../model/Etiqueta.js';
import sequelize  from '../db/config.js';
import { Coleccion } from '../model/Coleccion.js';

export async function procesarPublicaciones(publicaciones) {
    try {
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
            const guardados = (pub.Guardados || []).map(g => ({
                id_guardado: g.id_guardado,
                id_usuario: g.Usuario ? g.Usuario.id_usuario : null,
                coleccion: g.Coleccion ? g.Coleccion.nombre : null
            }));

            const imagenesProcesadas = [];
            
            const imagenes = pub.Imagens || [];
            
            for(const imagen of imagenes) {
                if (imagen && imagen.contenido && imagen.nombre) {
                    const imgsBase64 = imagen.contenido.toString('base64');
                    const sufix = `data:image/${imagen.metadata};base64,`;
                    
                    //Comentarios asociados a la imagen
                    const comentarios = (imagen.Comentarios || []).map(c => ({
                        id: c.id_comentario,
                        texto: c.descripcion,
                        autor: c.Usuario ? `${c.Usuario.firstName} ${c.Usuario.lastName}` : 'Usuario',
                        fecha: c.createdAt ? c.createdAt.toLocaleDateString() : ''
                    }));

                    imagenesProcesadas.push({
                        id: imagen.id_imagen,
                        name: imagen.nombre,
                        src: sufix + imgsBase64,
                        descripcion: imagen.descripcion || '',
                        comentarios: comentarios,
                        promedio: imagen.dataValues.promedio || null,
                        estado: imagen.estado
                    });
                    //console.log('Primera publicación:', JSON.stringify(imagenesProcesadas[0].estado, null, 2));
                } else {
                    console.log(`    Imagen inválida:`, imagen);
                }
            }
            console.log('Etiquetas crudas:', pub.Etiquetas);
            
            publicacionesProcesadas.push({
                id: pub.id_publicacion,
                titulo: pub.titulo,
                descripcion: pub.descripcion,
                imagenes: imagenesProcesadas,
                etiquetas: (pub.Etiquetas || []).map(e => e.etiqueta),
                id_usuario: pub.Usuario ? pub.Usuario.id_usuario : null,
                autor: pub.Usuario ? `${pub.Usuario.firstName} ${pub.Usuario.lastName}` : 'Desconocido',
                fecha: pub.createdAt ? pub.createdAt.toLocaleDateString() : '',
                guardados: guardados
            });
        }

        return publicacionesProcesadas;
        
    } catch(error) {
        console.error(error);
        res.status(500).send('Error al cargar la galería');
    }
}