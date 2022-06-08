import { Usuario } from "./usuario";

export class Empleado extends Usuario
 {
    perfil: 'EMPLEADO' = 'EMPLEADO';
    rol: 'METRE' | 'MOZO' | 'COCINERO' | 'BARTENDER';
    cuil: number;
}
