import { Usuario } from "../model/Usuario.js";
import { validarUsuario } from "../helpers/validaciones.js"

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