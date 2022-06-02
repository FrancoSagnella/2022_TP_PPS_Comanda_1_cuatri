import { User } from "./user";

export class Empleado extends User {
    perfil: 'EMPLEADO' = 'EMPLEADO';
    rol: 'METRE' | 'MOZO' | 'COCINERO' | 'BARTENDER';
    cuil: number;
}