import { EstadoPublicacion } from "@mocks/DropdownOptions";

export default function useArticuloHelper() {
    const getClassByState = (state: EstadoPublicacion): string => {
        let className = '';
        switch (state) {
            case EstadoPublicacion.Publicado:
                className = 'badge text-bg-primary';
                break;
            case EstadoPublicacion.NoPublicado:
                className = 'badge text-bg-danger';
                break;
            default:
                className = 'badge text-bg-default';
                break;
        }
        return className;
    }

    return { getClassByState };
}