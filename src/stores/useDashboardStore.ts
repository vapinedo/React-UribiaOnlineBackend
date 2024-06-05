import { create } from 'zustand';
import { PersistStorage, persist } from 'zustand/middleware';
import useClienteStore from './useBarrioStore';
import useEmpleadoStore from './useEmpleadoStore';
import usePrestamoStore from './useArticuloStore';

interface DashboardStore {
    totalClientes: number;
    totalEmpleados: number;
    totalPrestamos: number;
    loading: boolean;
    error: string | null;
    fetchTotals: () => Promise<void>;
}

const storage: PersistStorage<DashboardStore> = {
    getItem: (name) => {
        const item = sessionStorage.getItem(name);
        if (item) {
            const parsed = JSON.parse(item);
            return {
                ...parsed,
            };
        }
        return null;
    },
    setItem: (name, value) => {
        const serializedState = JSON.stringify(value);
        sessionStorage.setItem(name, serializedState);
    },
    removeItem: (name) => sessionStorage.removeItem(name),
};

const useDashboardStore = create<DashboardStore>()(
    persist(
        (set) => ({
            totalClientes: 0,
            totalEmpleados: 0,
            totalPrestamos: 0,
            loading: false,
            error: null,

            fetchTotals: async () => {
                try {
                    set({ loading: true, error: null });
                    await Promise.all([
                        useClienteStore.getState().getTotalRecords(),
                        useEmpleadoStore.getState().getTotalRecords(),
                        usePrestamoStore.getState().getTotalRecords(),
                    ]);
                    const totalClientes = useClienteStore.getState().totalRecords;
                    const totalEmpleados = useEmpleadoStore.getState().totalRecords;
                    const totalPrestamos = usePrestamoStore.getState().totalRecords;
                    set({ totalClientes, totalEmpleados, totalPrestamos, loading: false });
                } catch (error) {
                    set({ loading: false, error: 'Error al obtener los totales' });
                    console.error(error);
                }
            }
        }),
        {
            name: "dashboard-store",
            storage,
        }
    )
);

export default useDashboardStore;
