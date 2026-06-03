import { Usuario } from "../model/Usuario.js";

export async function authMiddleware(req, res, next) {
  const sessionUsuario = req.session.usuario; // usuario de la sesion solo contiene id
  if(!sessionUsuario) {
    res.redirect('/auth/login');
    return;
  }

  //id porque en el controller lo definimos asi
  const userId = Number(sessionUsuario.id);

  try {
    const dbusuario = await Usuario.findByPk(userId, {
      attributes: ['id_usuario', 'firstName', 'lastName'],
    });

    if (!dbusuario) {
      res.redirect('/auth/login');
      return;
    }

    //Para que la vista de pug pueda usarla
    res.locals.currentUser = {
      id_usuario: dbusuario.id_usuario,
      firstName: dbusuario.firstName,
      lastName: dbusuario.lastName,
      rol: 'admin'
    };
  } catch (error) {
    console.error('[!] Error al autenticar usuario:', error);
  }
  next();
}