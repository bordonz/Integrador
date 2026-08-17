import { Usuario } from "../model/Usuario.js";
import { validarUsuario } from "../helpers/validaciones.js"
import { Publicacion } from "../model/Publicacion.js"; 
import { Imagen } from '../model/Imagen.js';
import { Comentario } from '../model/Comentario.js';
import { Valoracion } from '../model/Valoracion.js';
import { Etiqueta } from '../model/Etiqueta.js';
import { Seguir } from "../model/Seguir.js";
import sequelize from '../db/config.js';
import { procesarPublicaciones } from "../helpers/procesarPubs.js";
import { Guardado } from "../model/Guardado.js";

//TODO: Usar las alertas
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
            { model: Guardado,
                include: [ Publicacion ]
             },
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
                as: 'Etiquetas',
                through: { attributes: [] }
                }
            ]
            }
        ]
    });

    if (!usuario) {
      return res.status(404).render('error', { message: 'Usuario no encontrado' });
    }
    const publicacionesProcesadas = await procesarPublicaciones(usuario.Publicacions);

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