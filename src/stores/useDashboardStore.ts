import { create } from 'zustand';
import useBarrioStore from '@stores/useBarrioStore';
import useArticuloStore from '@stores/useArticuloStore';
import { PersistStorage, persist } from 'zustand/middleware';

interface DashboardStore {
    totalBarrios: number;
    totalArticulos: number;
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
            totalBarrios: 0,
            totalArticulos: 0,
            loading: false,
            error: null,

            fetchTotals: async () => {
                try {
                    set({ loading: true, error: null });
                    await Promise.all([
                        useBarrioStore.getState().getTotalRecords(),
                        useArticuloStore.getState().getTotalRecords(),
                    ]);
                    const totalBarrios = useBarrioStore.getState().totalRecords;
                    const totalArticulos = useArticuloStore.getState().totalRecords;
                    set({ totalBarrios, totalArticulos, loading: false });
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
