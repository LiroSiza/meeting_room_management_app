export interface Room {
    _id?: string; // _id para adaptarnos a la base de datos
    id?: string;  // id es el campo que usamos en la aplicación
    nombre: string;
    capacidad: number;
    estado: string;
}
