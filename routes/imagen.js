import { Router } from "express";
import { mostrarPublicacion } from '../controller/imagen.js';

const router = Router();

router.get('/galeria', mostrarPublicacion)

export default router;