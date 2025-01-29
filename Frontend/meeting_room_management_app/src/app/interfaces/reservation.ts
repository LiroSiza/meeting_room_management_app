export interface Reservation {
    _id?: string; // _id para adaptarnos a la base de datos
    idSala: string;
    usuario: string;
    fechaInicio: Date;
    fechaFin: Date;
    estado: string;
}
