import { Router } from "express";
import { dejarDeSeguir, seguirUsuario } from "../controller/seguir.js";

const router = Router();

router.post('/:id', seguirUsuario)

router.post('/:id/unfollow', dejarDeSeguir)

export default router;