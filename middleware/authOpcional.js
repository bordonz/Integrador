import { Usuario } from "../model/Usuario.js";

export async function optionalAuth(req, res, next) {
  const sessionUsuario = req.session.usuario;
  if (sessionUsuario) {
    try {
      const userId = Number(sessionUsuario.id); // leer "id"
      const dbusuario = await Usuario.findByPk(userId, {
        attributes: ['id_usuario', 'firstName', 'lastName'],
      });
      if (dbusuario) {
        res.locals.currentUser = {
          id_usuario: dbusuario.id_usuario,
          firstName: dbusuario.firstName,
          lastName: dbusuario.lastName,
        };
      }
    } catch (error) {
      console.error('[!] Error al cargar usuario opcional:', error);
    }
  }
  next();
}
