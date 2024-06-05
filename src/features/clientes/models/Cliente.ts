export interface Cliente {
    id: string;
    nombres: string;
    apellidos: string;
    correo?: string | null;
    celular: string;
    direccion: string;
}