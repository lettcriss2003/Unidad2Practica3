import { enviar } from "./Conexion";
import { save, saveToken } from "./SessionUtil";

export async function inicio_sesion(data) {
  const sesion = await enviar('usuario/inicio_sesion', data);
  console.log(data);
  console.log(sesion.data.external_id);

  if (sesion && sesion.code === 200 && sesion.data.user) {
    save('external_id',sesion.data.external_id)
    saveToken(sesion.data.token);
    save('user', sesion.data.user);
    save('rol', sesion.data.rol);
  }

  return sesion;
}