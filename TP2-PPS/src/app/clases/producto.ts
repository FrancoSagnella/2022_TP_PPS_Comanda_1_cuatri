
export class Producto {
    id: string;
    nombreProducto: string;
    descripcion: string;
    tiempo: number;
    precio: number;
    tipo: 'BEBIDA' | 'COMIDA' | 'POSTRE';
    img_src: string[];
}