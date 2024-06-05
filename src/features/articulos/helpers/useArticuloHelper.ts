import { EstadoArticulo } from "@mocks/DropdownOptions";

export default function useArticuloHelper() {
    const getClassByState = (state: EstadoArticulo): string => {
        let className = '';
        switch (state) {
            case EstadoArticulo.Publicado:
                className = 'badge text-bg-primary';
                break;
            case EstadoArticulo.NoPublicado:
                className = 'badge text-bg-success';
                break;
            default:
                className = 'badge text-bg-default';
                break;
        }
        return className;
    }

    return { getClassByState };
}