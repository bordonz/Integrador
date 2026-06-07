import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import { connectDatabase } from './model/index.js';

import usuarioRouter from './routes/usuario.js';
import seguirRouter from './routes/seguir.js';                  
import publicacionRouter from './routes/publicacion.js';
import valoracionRouter from './routes/valoracion.js';
import authRouter from './routes/auth.js';
import imagenRouter from './routes/imagen.js';
import buscadorRouter from './routes/buscador.js';

import { optionalAuth } from './middleware/authOpcional.js';
import { crearNuevoUsuario } from './controller/usuario.js';
import { authMiddleware } from './middleware/auth.js';

// CONSTANTES
const PORT = process.env.PORT;

const app = express();

// MIDDLEWARES
app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // produccion cambiar a true
    maxAge: 24 * 60 * 60 * 1000, // 24h
    httpOnly: true,
    sameSite: 'lax', 
  },
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use((req, res, next)=>{
  res.locals.currentPath = req.path;
  next()
})

// MOTOR DE PLANTILLAS
app.set('view engine', 'pug');
app.set('views', './views');

// RUTAS
app.use('/usuario', authMiddleware, usuarioRouter);

app.use('/publicacion', authMiddleware, publicacionRouter);

app.use('/valoracion', authMiddleware, valoracionRouter);

app.use('/auth', authRouter);

//TODO: validar auth para seguir 
app.use('/seguir', seguirRouter);

app.use('/', optionalAuth, imagenRouter);

app.use('/buscar', buscadorRouter);

// CONEXION A BD
connectDatabase()
  .then(() => {
    app.listen(PORT, (err) => {
      if(err) {
        console.error('[+] Error al iniciar el servidor:', err);
        return;
      }
      console.log(`[+] Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[+] Error sincronizando con bd:', err)
  })