import { create } from 'zustand';
import { Barrio } from '@features/barrios/models/Barrio';
import { PersistStorage, persist } from 'zustand/middleware';
import useBarrioService from '@app/services/useBarrioService';
import { AutocompleteOption } from '@models/AutocompleteOption';

const barrioService = useBarrioService();

interface BarrioStore {
  barrios: Barrio[];
  barrioOptions: AutocompleteOption[];
  totalRecords: number;
  loading: boolean;
  error: string | null;
  fetchBarrios: () => Promise<void>;
  getBarrioOptions: () => Promise<void>;
  getBarrio: (id: string) => Barrio | undefined;
  createBarrio: (barrio: Barrio) => Promise<void>;
  updateBarrio: (barrio: Barrio) => Promise<void>;
  deleteBarrio: (id: string) => Promise<void>;
  getTotalRecords: () => Promise<void>;
}

const serialize = (document: Barrio): any => {
  return {
    ...document,
  };
};

const deserialize = (prestamo: any): Barrio => {
  return {
    ...prestamo,
  };
};

const storage: PersistStorage<BarrioStore> = {
  getItem: (name) => {
    const item = sessionStorage.getItem(name);
    if (item) {
      const parsed = JSON.parse(item);
      return {
        ...parsed,
        state: {
          ...parsed.state,
          barrios: parsed.state.barrios.map(deserialize),
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
        barrios: value.state.barrios.map(serialize),
      },
    });
    sessionStorage.setItem(name, serializedState);
  },
  removeItem: (name) => sessionStorage.removeItem(name),
};

const useBarrioStore = create<BarrioStore>()(
  persist(
    (set, get) => ({
      barrios: [],
      barrioOptions: [],
      totalRecords: 0,
      loading: false,
      error: null,

      fetchBarrios: async () => {
        try {
          set({ loading: true, error: null });
          const barrios = await barrioService.getAllBarrios();
          set({ barrios, barrioOptions: [], loading: false });
        } catch (error) {
          set({ loading: false, error: 'Error al obtener los barrios' });
          console.error(error);
        }
      },

      getBarrioOptions: async () => {
        try {
          set({ loading: true, error: null });
          const barrioOptions = await barrioService.getBarrioOptions();
          set({ barrios: [], barrioOptions, loading: false });
        } catch (error) {
          set({ loading: false, error: 'Error al obtener opciones de barrios' });
          console.error(error);
        }
      },

      getBarrio: (id: string) => {
        const { barrios } = get();
        return barrios.find(barrio => barrio.id === id);
      },

      createBarrio: async (barrio: Barrio) => {
        set({ loading: true, error: null });
        try {
          await barrioService.createBarrio(barrio);
          await get().fetchBarrios();
        } catch (error: unknown) {
          if (error instanceof Error) {
            set({ error: error.message, loading: false });
          } else {
            set({ error: String(error), loading: false });
          }
        }
      },

      updateBarrio: async (barrio: Barrio) => {
        set({ loading: true, error: null });
        try {
          await barrioService.updateBarrio(barrio);
          await get().fetchBarrios();
        } catch (error: unknown) {
          if (error instanceof Error) {
            set({ error: error.message, loading: false });
          } else {
            set({ error: String(error), loading: false });
          }
        }
      },

      deleteBarrio: async (id: string) => {
        set({ loading: true, error: null });
        try {
            await barrioService.deleteBarrio(id);
            await get().fetchBarrios();
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
          const totalRecords = await barrioService.getTotalRecords();
          set({ totalRecords, loading: false });
        } catch (error) {
          set({ loading: false, error: 'Error al obtener el total de barrios' });
          console.error(error);
        }
      }

    }),
    {
      name: "barrios-store",
      storage,
    }
  )
);

export default useBarrioStore;
