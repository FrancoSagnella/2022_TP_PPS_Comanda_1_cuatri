import { Usuario } from "./usuario";

export class Supervisor extends Usuario {
  public perfil: 'SUPERVISOR' = 'SUPERVISOR';
  public cuil: number;
}
