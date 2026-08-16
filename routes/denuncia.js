import { Router } from "express";
import { denunciarComentario } from "../controller/denuncia.js";

const router = Router();

router.post('/denunciarComentario', denunciarComentario);

export default router;