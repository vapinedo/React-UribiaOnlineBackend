export enum EstadoArticulo {
    Nuevo = "Nuevo",
    Usado = "Usado",
}

export enum EstadoPublicacion {
    Publicado = "Publicado",
    NoPublicado = "No publicado",
}

export const estadoArticuloOptions = Object.values(EstadoArticulo);
export const estadoPublicacionOptions = Object.values(EstadoPublicacion);