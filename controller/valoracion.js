import { Imagen } from '../model/Imagen.js';
import { Valoracion } from "../model/Valoracion.js";
import { Usuario } from "../model/Usuario.js";

//TODO: Validar que no 1 usuario no valorize mas de 1 vez
export async function subirValoracion(req, res) {
    try {
        const valor = req.body.valor
        console.log(valor)
        const idImagen = req.params.idImagen
        const idUsuario = req.session.usuario.id

        await Valoracion.crearValoracion({valor, idImagen, idUsuario});

        res.redirect('/galeria');
    }catch(error) {
        console.error(error)
        res.status(500).send('Error al crear la valoración');
    }
}