import { Router } from "express";
import { mostrarPublicacion } from '../controller/imagen.js';

const router = Router();
//TODO: Inecesario?
router.get('/', (req, res) => {
  res.redirect('/galeria');
});

router.get('/galeria', mostrarPublicacion)

export default router;