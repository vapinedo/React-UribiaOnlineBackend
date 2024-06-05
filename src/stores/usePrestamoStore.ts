import { create } from "zustand";
import { firebaseApp } from "@app/firebaseConfig";
import { doc, getFirestore } from "firebase/firestore";
import { persist, PersistStorage } from "zustand/middleware";
import usePrestamoService from "@services/usePrestamoService";
import { Prestamo } from "@features/prestamos/models/Prestamo";

// crear instancia unica de servicio prestamo
const prestamoService = usePrestamoService();

interface PrestamoStore {
    prestamos: Prestamo[];
    totalRecords: number;
    loading: boolean;
    error: string | null;
    fetchPrestamos: () => Promise<void>;
    getPrestamo: (id: string) => Prestamo | undefined;
    createPrestamo: (prestamo: Prestamo) => Promise<void>;
    updatePrestamo: (prestamo: Prestamo) => Promise<void>;
    deletePrestamo: (id: string) => Promise<void>;
    getTotalRecords: () => Promise<void>;
}

const firestore = getFirestore(firebaseApp);

const serializePrestamo = (prestamo: Prestamo): any => {
    return {
        ...prestamo,
        clienteRef: prestamo.clienteRef?.path || null,
        empleadoRef: prestamo.empleadoRef?.path || null,
    };
};

const deserializePrestamo = (prestamo: any): Prestamo => {
    return {
        ...prestamo,
        clienteRef: prestamo.clienteRef ? doc(firestore, prestamo.clienteRef) : null,
        empleadoRef: prestamo.empleadoRef ? doc(firestore, prestamo.empleadoRef) : null,
    };
};

const storage: PersistStorage<PrestamoStore> = {
    getItem: (name) => {
        const item = sessionStorage.getItem(name);
        if (item) {
            const parsed = JSON.parse(item);
            return {
                ...parsed,
                state: {
                    ...parsed.state,
                    prestamos: parsed.state.prestamos.map(deserializePrestamo),
                },
            };
        }
        return null;
    },
    setItem: (name, value) => {
        const serializedState = JSON.stringify({
            ...value,
            state: {
                ...value.state,
                prestamos: value.state.prestamos.map(serializePrestamo),
            },
        });
        sessionStorage.setItem(name, serializedState);
    },
    removeItem: (name) => sessionStorage.removeItem(name),
};

const usePrestamoStore = create<PrestamoStore>()(
    persist(
        (set, get) => ({
            prestamos: [],
            totalRecords: 0,
            loading: false,
            error: null,

            fetchPrestamos: async () => {
                set({ loading: true, error: null });
                try {
                    const prestamos = await prestamoService.getAllPrestamos();
                    set({ prestamos, loading: false });
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        set({ error: error.message, loading: false });
                    } else {
                        set({ error: String(error), loading: false });
                    }
                }
            },

            getPrestamo: (id: string) => {
                const { prestamos } = get();
                return prestamos.find(prestamo => prestamo.id === id);
            },

            createPrestamo: async (prestamo: Prestamo) => {
                set({ loading: true, error: null });
                try {
                    await prestamoService.createPrestamo(prestamo);
                    await get().fetchPrestamos();
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        set({ error: error.message, loading: false });
                    } else {
                        set({ error: String(error), loading: false });
                    }
                }
            },

            updatePrestamo: async (prestamo: Prestamo) => {
                set({ loading: true, error: null });
                try {
                    await prestamoService.updatePrestamo(prestamo);
                    // Fetch the updated list of prestamos
                    await get().fetchPrestamos();
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        set({ error: error.message, loading: false });
                    } else {
                        set({ error: String(error), loading: false });
                    }
                }
            },

            deletePrestamo: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    await prestamoService.deletePrestamo(id);
                    // Fetch the updated list of prestamos
                    await get().fetchPrestamos();
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        set({ error: error.message, loading: false });
                    } else {
                        set({ error: String(error), loading: false });
                    }
                }
            },

            getTotalRecords: async () => {
                try {
                    set({ loading: true, error: null });
                    const totalRecords = await prestamoService.getTotalRecords();
                    set({ totalRecords, loading: false });
                } catch (error) {
                    set({ loading: false, error: 'Error al obtener el total de prestamos' });
                    console.error(error);
                }
            }

        }),
        {
            name: "prestamos-store",
            storage,
        }
    )
);

export default usePrestamoStore;
