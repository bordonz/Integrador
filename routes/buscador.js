import { Router } from "express";
import { buscar } from "../controller/buscador.js";

const router = Router();

router.get('/', buscar);

export default router;
