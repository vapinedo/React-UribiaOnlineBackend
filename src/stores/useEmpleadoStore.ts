import { create } from 'zustand';
import { PersistStorage, persist } from 'zustand/middleware';
import useEmpleadoService from '@services/useEmpleadoService';
import { Empleado } from '@features/empleados/models/Empleado';
import { AutocompleteOption } from '@models/AutocompleteOption';

// crear instancia unica del servicio empleados
const empleadoService = useEmpleadoService();

interface EmpleadoStore {
  empleados: Empleado[];
  empleadoOptions: AutocompleteOption[];
  totalRecords: number;
  loading: boolean;
  error: string | null;
  fetchEmpleados: () => Promise<void>;
  getEmpleadoOptions: () => Promise<void>;
  getEmpleado: (id: string) => Empleado | undefined;
  createEmpleado: (empleado: Empleado) => Promise<void>;
  updateEmpleado: (empleado: Empleado) => Promise<void>;
  deleteEmpleado: (id: string) => Promise<void>;
  getTotalRecords: () => Promise<void>;
}

const serialize = (document: Empleado): any => {
  return {
    ...document,
  };
};

const deserialize = (prestamo: any): Empleado => {
  return {
    ...prestamo,
  };
};

const storage: PersistStorage<EmpleadoStore> = {
  getItem: (name) => {
    const item = sessionStorage.getItem(name);
    if (item) {
      const parsed = JSON.parse(item);
      return {
        ...parsed,
        state: {
          ...parsed.state,
          empleados: parsed.state.empleados.map(deserialize),
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
        empleados: value.state.empleados.map(serialize),
      },
    });
    sessionStorage.setItem(name, serializedState);
  },
  removeItem: (name) => sessionStorage.removeItem(name),
};

const useEmpleadoStore = create<EmpleadoStore>()(
  persist(
    (set, get) => ({
      empleados: [],
      empleadoOptions: [],
      totalRecords: 0,
      loading: false,
      error: null,

      fetchEmpleados: async () => {
        try {
          set({ loading: true, error: null });
          const empleados = await empleadoService.getAllEmpleados();
          set({ empleados, empleadoOptions: [], loading: false });
        } catch (error) {
          set({ loading: false, error: 'Error al obtener los empleados' });
          console.error(error);
        }
      },

      getEmpleadoOptions: async () => {
        try {
          set({ loading: true, error: null });
          const empleadoOptions = await empleadoService.getEmpleadoOptions();
          set({ empleados: [], empleadoOptions, loading: false });
        } catch (error) {
          set({ loading: false, error: 'Error al obtener opciones de empleados' });
          console.error(error);
        }
      },

      getEmpleado: (id: string) => {
        const { empleados } = get();
        return empleados.find(empleado => empleado.id === id);
      },

      createEmpleado: async (empleado: Empleado) => {
        set({ loading: true, error: null });
        try {
          await empleadoService.createEmpleado(empleado);
          await get().fetchEmpleados();
        } catch (error: unknown) {
          if (error instanceof Error) {
            set({ error: error.message, loading: false });
          } else {
            set({ error: String(error), loading: false });
          }
        }
      },

      updateEmpleado: async (empleado: Empleado) => {
        set({ loading: true, error: null });
        try {
          await empleadoService.updateEmpleado(empleado);
          await get().fetchEmpleados();
        } catch (error: unknown) {
          if (error instanceof Error) {
            set({ error: error.message, loading: false });
          } else {
            set({ error: String(error), loading: false });
          }
        }
      },

      deleteEmpleado: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await empleadoService.deleteEmpleado(id);
          await get().fetchEmpleados();
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
          const totalRecords = await empleadoService.getTotalRecords();
          set({ totalRecords, loading: false });
        } catch (error) {
          set({ loading: false, error: 'Error al obtener el total de empleados' });
          console.error(error);
        }
      }

    }),
    {
      name: "empleados-store",
      storage,
    }
  )
);

export default useEmpleadoStore;
