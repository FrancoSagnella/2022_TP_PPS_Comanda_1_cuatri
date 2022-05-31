export abstract class Usuario {
  public id: string;
  public nombre: string;
  public apellido: string;
  public dni: number;
  public img: string;
  public estado: 'ACEPTADO' | 'PENDIENTE' | 'RECHAZADO';
  public correo: string;
  public fechaCreacion: number;
}
