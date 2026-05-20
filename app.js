import 'dotenv/config';
import express from 'express';
import { connectDatabase } from './model/index.js';

// CONSTANTES
const PORT = process.env.PORT;

const app = express();

// MIDDLEWARES
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MOTOR DE PLANTILLAS
app.set('view engine', 'pug');
app.set('views', './views');

// RUTAS


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