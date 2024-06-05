export enum EstadoPrestamo {
    Activo = "Activo",
    CerradoExitoso = "Exitoso",
    CerradoFallido = "Fallido",
}

export enum ModalidadDePago {
    Diario = "Diario",
    Semanal = "Semanal",
    Quincenal = "Quincenal",
    TerminoFijo = "Termino Fijo",
}

export const estadoPrestamoOptions = Object.values(EstadoPrestamo);
export const modalidadDePagoOptions = Object.values(ModalidadDePago);