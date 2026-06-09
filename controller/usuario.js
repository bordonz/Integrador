import { Usuario } from "../model/Usuario.js";
import { validarUsuario } from "../helpers/validaciones.js"
import { Publicacion } from "../model/Publicacion.js"; 
import { Imagen } from '../model/Imagen.js';
import { Comentario } from '../model/Comentario.js';
import { Valoracion } from '../model/Valoracion.js';
import { Etiqueta } from '../model/Etiqueta.js';
import { Seguir } from "../model/Seguir.js";
import sequelize from '../db/config.js';

export async function crearNuevoUsuario(req, res) {
    try {
        const body = req.body
        const { firstName, lastName, email, password } = body;

        const validacion = validarUsuario({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        })

        if(validacion.succes === false) {
            const errorFirstName = validacion.errors.firstName;
            const errorLastName = validacion.errors.lastName;
            const errorEmail = validacion.errors.email;
            const errorPassword = validacion.errors.password;
            let msg = '';

            if(errorFirstName) {
                for(const e of errorFirstName) {
                    msg += ' ' + e
                }
            }

            if(errorLastName) {
                for(const e of errorLastName) {
                    msg += ' ' + e
                }
            }

            if(errorEmail) {
                for(const e of errorEmail) {
                    msg += ' ' + e
                }
            }

            if(errorPassword) {
                for(const e of errorPassword) {
                    msg += ' ' + e
                }
            }

            res.status(400).render('usuario/error'), {msg: msg, alert}
            return
        }

        const nuevoUsuario = {
            firstName,
            lastName,
            email,
            password,
        }
        
        await Usuario.crearUsuario(nuevoUsuario);

    }catch(err) {
        console.log(err, 'Error al crear al usuario')
    }
};

export async function seguirUsuario(params) {
    
}

export async function cargarPerfil(req, res) {
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    return res.status(400).send('ID de usuario inválido');
  }

  const idLogueado = req.session?.usuario?.id;
  try {
    const usuario = await Usuario.findByPk(userId, {
      attributes: ['id_usuario', 'firstName', 'lastName', 'email'],
        include: [
            { model: Usuario, as: 'Seguidores' },
            { model: Usuario, as: 'Seguidos' },
            {
            model: Publicacion,
            attributes: ['id_publicacion', 'titulo', 'descripcion', 'estado'],
            include: [
                {
                model: Imagen,
                include: [{
                    model: Comentario,
                    include: [Usuario]
                }]
                },
                {
                model: Etiqueta,
                through: { attributes: [] }
                }
            ]
            }
        ]
    });

    if (!usuario) {
      return res.status(404).render('error', { message: 'Usuario no encontrado' });
    }

    // Procesar publicaciones igual que en gallery
    const publicacionesProcesadas = [];

    for (const pub of usuario.Publicacions) {
      const imagenesProcesadas = [];

      for (const img of pub.Imagens || []) {
        // calcular promedio de valoraciones
        const promedio = await Valoracion.findAll({
          attributes: [[sequelize.fn('AVG', sequelize.col('puntaje')), 'promedio']],
          where: { id_imagen: img.id_imagen },
          raw: true
        });

        const comentarios = (img.Comentarios || []).map(c => ({
          id: c.id_comentario,
          texto: c.descripcion,
          autor: c.Usuario ? `${c.Usuario.firstName}` : 'Usuario',
          fecha: c.createdAt ? c.createdAt.toLocaleString() : ''
        }));

        imagenesProcesadas.push({
          id: img.id_imagen,
          name: img.nombre,
          src: `data:image/${img.metadata};base64,${img.contenido.toString('base64')}`,
          descripcion: img.descripcion || '',
          comentarios,
          promedio: promedio[0].promedio ? parseInt(promedio[0].promedio) : null
        });
      }

      publicacionesProcesadas.push({
        id: pub.id_publicacion,
        titulo: pub.titulo,
        descripcion: pub.descripcion,
        imagenes: imagenesProcesadas,
        etiquetas: (pub.Etiquetas || []).map(e => e.nombre),
        id_usuario: usuario.id_usuario,
        autor: `${usuario.firstName} ${usuario.lastName}`
      });
    }

    // Verificar si el logueado sigue al usuario
    const estaSeguido = await Seguir.findOne({
      where: { id_seguidor: idLogueado, id_seguido: userId }
    });

    res.render('usuario/perfil', {usuario, publicaciones: publicacionesProcesadas, estaSeguido: !!estaSeguido});

  } catch (error) {
    console.error('[!] Error cargando perfil:', error);
    res.status(500).render('error', { message: 'Error interno' });
  }
}