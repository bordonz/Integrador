import { Router } from 'express';
import { Imagen } from '../model/Imagen.js'
import { subirComentario, subirPublicacion } from '../controller/publicacion.js';

const router = Router();

//router.get('/gallery', mostrarPublicacion)

router.get('/Subir', (req, res) => {
    res.render('publicacion/crearPublicacion')
})
   
router.post('/crearPublicacion', subirPublicacion)

router.post('/crearComentario/:idImagen', subirComentario)

export default router;
