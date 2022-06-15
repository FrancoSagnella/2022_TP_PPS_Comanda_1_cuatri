export class Pedido {
    id: string;
    correo: string;
    mesa_numero: number;
    producto_id: [{ id: string, quantity: number, price: number, name: string }] | null;
    date_created: number;
    date_updated: number;
    estado: 'PENDIENTE' | 'CANCELADO' | 'ACEPTADO' | 'PREPARACION' | 'COCINADO' | 'ENTREGADO' | 'CONFIRMADO' | 'COBRAR' | 'COBRADO' | 'ENCUESTADO';
    encuestado: boolean;
    descuento: 'NO JUGO' | 'GANO' | 'PERDIO';
}

//  PENDIENTE: metre es quien asignará este estado, cuando ingresa cliente al local, luego cuando hace el pedido aparece en el lsitado del mozo.
//  CANCELADO: mozo/cliente es quien asignará este estado, alguno lo cancela
//  ACEPTADO: mozo es quien asignará este estado, el mozo acepta un pedido que estaba como pendiente, una vez esta aceptado aparece en el listado del cocinero.
//  PREPARACION: cocinero asigna este estado, el cocinero agarra un pedido aceptado y lo pone en preparacion
//  COCINADO: cocinero asigna este estado, el cocinero dice que un coso en preparacion ya se terminó
//  ENTREGADO: mozo lo asigna, una vez que en el listado del mozo aparece como cocinado, este lo marca como entregado (representa que lo lleva a la mesa)
//  CONFIRMADO: cliente es quien asignará este estado, una vez que el mozo llevo el pedido a la mesa, el cliente confirma que lo acepto
//  COBRAR: cliente es quien asignará este estado, se pide la cuenta (mostraria una pantalla con los montos, dejando escanear qr para dar propina), una vez se confirma se pone este estado.
//  COBRADO: mozo es quien asignará este estado, el mozo ve los pedidos en estado cobrear, y confirma el pago.

