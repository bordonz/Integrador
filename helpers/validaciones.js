
import * as z from "zod";

//ESQUEMA DE VALIDACION DE USUARIO
const Usuario = z.object({
    //id_usuario: z.number("El id del usuario debe ser numerico"),
    firstName: z.string('El firsName debe ser un texto')
    .max(50, "El firstName debe tener como máximo 50 caracteres")
    .min(5, "El fisrtName debe tener como minimo 5 caracteres"),
    lastName: z.string('El lastName debe ser un texto')
    .max(50, "El lastName debe tener como máximo 50 caracteres")
    .min(5, "El lastName debe tener como minimo 5 caracteres"),
    email: z.email('El email esta mal definido'),
    password: z.string('El password debe ser un texto')
    .max(50, "El password debe tener como máximo 40 caracteres")
    .min(5, "El password debe tener como minimo 5 caracteres"),
});

// FUNCIONES DE VALIDACION - exportadas para ser usadas en rutas, controladores, etc
export function validarUsuario(usuario) {
    const resultado = Usuario.safeParse(usuario);

    if(resultado.success === false){
    return {
      success: false,
      errors: z.flattenError(resultado.error).fieldErrors
    }
  }
  
  return {
    success: true
  }
}