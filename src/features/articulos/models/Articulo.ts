import { AuditData } from "@app/models/AuditData";
import { DocumentReference } from "firebase/firestore";

export interface Articulo {
    id: string;
    nombre: string;
    precio: string;
    audit: AuditData;
    imagenURLs: string[];
    estadoArticulo: string;
    estadoPublicacion: string;
    descripcion: string | null;
    barrioRef: DocumentReference | null;
}