import { Router } from "express";
import { cargarPerfil, crearNuevoUsuario } from "../controller/usuario.js";
import { Usuario } from "../model/Usuario.js";
import { Publicacion } from "../model/Publicacion.js";

// /usuario
const router = Router()

// GET: muestra el formulario
router.get('/nuevo', (req, res) => {
  res.render('usuario/nuevo');
});

// POST: procesa el formulario
router.post('/nuevo', crearNuevoUsuario);

router.get('/:id', cargarPerfil);

export default router;
