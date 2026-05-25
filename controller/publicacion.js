import { Imagen } from '../model/Imagen.js';
import { Publicacion } from '../model/Publicacion.js';

export async function mostrarPublicacion(req, res) {
/*     try {
    const publicaciones = await Publicacion.findAll({
      include: [Imagen] // Sequelize trae las imágenes asociadas
    });

    const arregloPublicaciones = publicaciones.map(pub => {
      const imagenes = pub.Imagens.map(img => {
        const imgsBase64 = img.contenido.toString('base64');
        const sufix = `${img.metadata};base64,`;
        return {
          name: img.nombre,
          src: `data:${sufix}${imgsBase64}`
        };
      });

      return {
        titulo: pub.titulo,
        descripcion: pub.descripcion,
        imagenes
      };
    });

    res.render('publicacion/gallery', {
      publicaciones: arregloPublicaciones || []
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar la galería');
  }
} */

    try {
        const imagenes = await Imagen.findAll();

        const arregloImagenes = [];
        for(const imagen of imagenes) {
            if (imagen && imagen.contenido && imagen.nombre) { // Validación adicional
                const imgsBase64 = imagen.contenido.toString('base64');
                const sufix = `data:image/${imagen.metadata};base64,`
                arregloImagenes.push({
                    name: imagen.nombre,
                    src: sufix + imgsBase64
                })
            } else {
                console.warn('Imagen inválida encontrada:', imagen);
            }
        }
        console.log('Imagenes procesadas: ', arregloImagenes.length);
        console.log(arregloImagenes);
        res.render('publicacion/gallery', {
            imagenes : arregloImagenes || []
        })
    }catch(error) {
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
};


