import { DocumentReference } from "firebase/firestore";

export interface Prestamo {
    id: string;
    estado: string;
    fechaFinal: number;
    fechaInicio: number;
    interes: number | null;
    modalidadDePago: string;
    monto_prestado: string;
    monto_adeudado: string;
    monto_abonado: string;
    clienteRef: DocumentReference | null;
    empleadoRef: DocumentReference | null;
}