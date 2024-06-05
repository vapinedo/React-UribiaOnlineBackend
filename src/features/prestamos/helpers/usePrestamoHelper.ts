import { EstadoPrestamo } from "@mocks/DropdownOptions";
import { Prestamo } from "@features/prestamos/models/Prestamo";

export default function usePrestamoHelper() {

    const getMontoAdeudado = ({ monto_prestado, interes, monto_abonado }: Prestamo) => {
        let montoAdeudado = 0;
        let montoAbonado = Number(monto_abonado.replace(/\./g, ''));
        let montoPrestado = Number(monto_prestado.replace(/\./g, ''));
        let utilidad = montoPrestado * (interes! / 100);

        if (montoAbonado) {
            montoAdeudado = (montoPrestado + utilidad) - montoAbonado;
        } else {
            montoAdeudado = montoPrestado + utilidad;
        }

        let montoMoneda = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0 
        }).format(montoAdeudado);

        let montoSinSigno = montoMoneda.replace(/[^\d.,]/g, '');

        return montoSinSigno;
    };
    
    const getClassByState = (state: EstadoPrestamo): string => {
        let className = '';
        switch (state) {
            case EstadoPrestamo.Activo:
                className = 'badge text-bg-primary';
                break;
            case EstadoPrestamo.CerradoExitoso:
                className = 'badge text-bg-success';
                break;
            case EstadoPrestamo.CerradoFallido:
                className = 'badge text-bg-danger';
                break;
            default:
                className = 'badge text-bg-default';
                break;
        }
        return className;
    }

    return { getMontoAdeudado, getClassByState };
}