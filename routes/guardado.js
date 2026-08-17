import { Router } from "express";
import { mostrarGuardados, crearColeccion, obtenerColecciones, guardarPub } from "../controller/guardado.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.get('/mostrar', mostrarGuardados)

router.get('/obtenerColecciones', obtenerColecciones)

router.post('/crearColeccion', authMiddleware, crearColeccion)

router.post('/guardarPub', authMiddleware, guardarPub)

export default router;