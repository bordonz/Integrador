import { Denuncia } from "../model/Denuncia.js";

export async function denunciarComentario(req, res) {
    try {
        const prueba =  req.body.idComentario;
        console.log(prueba)
        const denuncia = {
            estado: "pendiente",
            titulo: req.body.valor,
            descripcion: req.body.descripcion,
            id_comentario: req.body.idComentario,
            id_imagen: req.body.idImagen,
            id_usuario: req.session.usuario.id
        };

        await Denuncia.crearDenuncia(denuncia);
        res.redirect('/galeria');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al registrar la denuncia de comentario");
    }
}