import { create } from 'zustand';
import { Cliente } from '@features/clientes/models/Cliente';
import useClienteService from '@services/useClienteService';
import { PersistStorage, persist } from 'zustand/middleware';
import { AutocompleteOption } from '@models/AutocompleteOption';

// Crear instancia única del servicio de clientes
const clienteService = useClienteService();

interface ClienteStore {
  clientes: Cliente[];
  clienteOptions: AutocompleteOption[];
  totalRecords: number;
  loading: boolean;
  error: string | null;
  fetchClientes: () => Promise<void>;
  getClienteOptions: () => Promise<void>;
  getCliente: (id: string) => Cliente | undefined;
  createCliente: (cliente: Cliente) => Promise<void>;
  updateCliente: (cliente: Cliente) => Promise<void>;
  deleteCliente: (id: string) => Promise<void>;
  getTotalRecords: () => Promise<void>;
}

const serialize = (document: Cliente): any => {
  return {
    ...document,
  };
};

const deserialize = (prestamo: any): Cliente => {
  return {
    ...prestamo,
  };
};

const storage: PersistStorage<ClienteStore> = {
  getItem: (name) => {
    const item = sessionStorage.getItem(name);
    if (item) {
      const parsed = JSON.parse(item);
      return {
        ...parsed,
        state: {
          ...parsed.state,
          clientes: parsed.state.clientes.map(deserialize),
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
        clientes: value.state.clientes.map(serialize),
      },
    });
    sessionStorage.setItem(name, serializedState);
  },
  removeItem: (name) => sessionStorage.removeItem(name),
};

const useClienteStore = create<ClienteStore>()(
  persist(
    (set, get) => ({
      clientes: [],
      clienteOptions: [],
      totalRecords: 0,
      loading: false,
      error: null,

      fetchClientes: async () => {
        try {
          set({ loading: true, error: null });
          const clientes = await clienteService.getAllClientes();
          set({ clientes, clienteOptions: [], loading: false });
        } catch (error) {
          set({ loading: false, error: 'Error al obtener los clientes' });
          console.error(error);
        }
      },

      getClienteOptions: async () => {
        try {
          set({ loading: true, error: null });
          const clienteOptions = await clienteService.getClienteOptions();
          set({ clientes: [], clienteOptions, loading: false });
        } catch (error) {
          set({ loading: false, error: 'Error al obtener opciones de clientes' });
          console.error(error);
        }
      },

      getCliente: (id: string) => {
        const { clientes } = get();
        return clientes.find(cliente => cliente.id === id);
      },

      createCliente: async (cliente: Cliente) => {
        set({ loading: true, error: null });
        try {
          await clienteService.createCliente(cliente);
          await get().fetchClientes();
        } catch (error: unknown) {
          if (error instanceof Error) {
            set({ error: error.message, loading: false });
          } else {
            set({ error: String(error), loading: false });
          }
        }
      },

      updateCliente: async (cliente: Cliente) => {
        set({ loading: true, error: null });
        try {
          await clienteService.updateCliente(cliente);
          await get().fetchClientes();
        } catch (error: unknown) {
          if (error instanceof Error) {
            set({ error: error.message, loading: false });
          } else {
            set({ error: String(error), loading: false });
          }
        }
      },

      deleteCliente: async (id: string) => {
        set({ loading: true, error: null });
        try {
            await clienteService.deleteCliente(id);
            await get().fetchClientes();
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
          const totalRecords = await clienteService.getTotalRecords();
          set({ totalRecords, loading: false });
        } catch (error) {
          set({ loading: false, error: 'Error al obtener el total de clientes' });
          console.error(error);
        }
      }

    }),
    {
      name: "clientes-store",
      storage,
    }
  )
);

export default useClienteStore;
