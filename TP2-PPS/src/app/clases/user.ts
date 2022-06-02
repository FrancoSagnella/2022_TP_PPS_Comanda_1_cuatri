export abstract class User {
    id: string; //path of firebase's doc
    nombre: string;
    apellido: string;
    dni: number;
    img: string;
    estado: 'ACEPTADO' | 'PENDIENTE' | 'RECHAZADO';
    correo: string;
    fecha_creacion: number; //datetime in miliseconds
}