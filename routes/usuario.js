import { Router } from "express";
import { crearNuevoUsuario } from "../controller/usuario.js";

// /usuario
const router = Router()

// GET: muestra el formulario
router.get('/nuevo', (req, res) => {
  res.render('usuario/nuevo');
});

// POST: procesa el formulario
router.post('/nuevo', crearNuevoUsuario);

export default router;
