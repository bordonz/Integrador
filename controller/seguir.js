import { Seguir } from "../model/Seguir.js";
import { Usuario } from "../model/Usuario.js";
import { Publicacion } from "../model/Publicacion.js";

export async function seguirUsuario(req, res) {
  try {
    const idSeguidor = req.session.usuario.id; // el logueado
    const idSeguido = parseInt(req.params.id, 10);

    if (isNaN(idSeguido)) {
      return res.status(400).send("ID inválido");
    }

    if (idSeguidor === idSeguido) {
      return res.status(400).send("No podés seguirte a vos mismo");
    }

    // Evitar duplicados
    const existe = await Seguir.findOne({
      where: { id_seguidor: idSeguidor, id_seguido: idSeguido }
    });

    if (!existe) {
      await Seguir.create({ id_seguidor: idSeguidor, id_seguido: idSeguido });
    }

    //usuario seguido
    const usuario = await Usuario.findByPk(idSeguido, {
        include: [
            { model: Usuario, as: 'Seguidores' },
            { model: Usuario, as: 'Seguidos' },
        ]   
    });
    
    const estaSeguido = await Seguir.findOne({
        where: { id_seguidor: idSeguidor, id_seguido: idSeguido}
    });

    res.render('usuario/perfil', { usuario, estaSeguido: !!estaSeguido});
  } catch (error) {
    console.error("[!] Error al seguir:", error);
    res.status(500).send("Error interno");
  }
}

export async function dejarDeSeguir(req, res) {
  try {
    const idSeguidor = req.session.usuario.id; // el logueado
    const idSeguido = parseInt(req.params.id, 10);

    if (isNaN(idSeguido)) {
      return res.status(400).send("ID inválido");
    }

    if (idSeguidor === idSeguido) {
      return res.status(400).send("No podés dejar de seguirte a vos mismo");
    }

    // Buscar la relación
    const relacion = await Seguir.findOne({
      where: { id_seguidor: idSeguidor, id_seguido: idSeguido }
    });

    if (relacion) {
      await relacion.destroy();
      console.log(`[+] Usuario ${idSeguidor} dejó de seguir a ${idSeguido}`);
    } else {
      console.log(`[!] No existía relación: ${idSeguidor} → ${idSeguido}`);
    }

  } catch (error) {
    console.error("[!] Error al dejar de seguir:", error);
    res.status(500).send("Error interno");
  }
}
