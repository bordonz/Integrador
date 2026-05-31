import { Router } from "express"
import { Valoracion } from '../model/Valoracion.js'
import { subirValoracion } from "../controller/valoracion.js";
const router = Router();

router.post('/crearValoracion/:idImagen', subirValoracion)

export default router