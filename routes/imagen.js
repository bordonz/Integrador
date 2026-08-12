import { Router } from "express";
import { mostrarPublicacion } from '../controller/imagen.js';
import { cerrarComentarios } from "../controller/imagen.js";
import { denunciarImagen } from "../controller/imagen.js";

const router = Router();
//TODO: Inecesario?
router.get('/', (req, res) => {
  res.redirect('/galeria');
});

router.get('/galeria', mostrarPublicacion)

router.post('/cerrarComentarios/:idImagen', cerrarComentarios)

router.post('/denunciarImagen', denunciarImagen)

export default router;