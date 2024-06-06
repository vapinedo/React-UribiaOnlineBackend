import { create } from "zustand";
import { firebaseApp } from "@app/firebaseConfig";
import { doc, getFirestore } from "firebase/firestore";
import { persist, PersistStorage } from "zustand/middleware";
import useArticuloService from "@services/useArticuloService";
import { Articulo } from "@features/articulos/models/Articulo";

const articuloService = useArticuloService();

interface ArticuloStore {
    articulos: Articulo[];
    totalRecords: number;
    loading: boolean;
    error: string | null;
    fetchArticulos: () => Promise<void>;
    getArticulo: (id: string) => Articulo | undefined;
    createArticulo: (articulo: Articulo) => Promise<void>;
    updateArticulo: (articulo: Articulo) => Promise<void>;
    deleteArticulo: (id: string) => Promise<void>;
    getTotalRecords: () => Promise<void>;
    uploadImageForArticulo: (articuloId: string, imageFiles: FileList) => Promise<void>;
    deleteImagesForArticulo: (articuloId: string) => Promise<void>;
}

const firestore = getFirestore(firebaseApp);

// Funciones para serializar y deserializar los datos de Firebase
const serialize = (articulo: Articulo): any => {
    return {
        ...articulo,
        barrioRef: articulo.barrioRef?.path || null,
    };
};

const deserialize = (articulo: any): Articulo => {
    return {
        ...articulo,
        barrioRef: articulo.barrioRef ? doc(firestore, articulo.barrioRef) : null,
    };
};

const storage: PersistStorage<ArticuloStore> = {
    getItem: (name) => {
        const item = sessionStorage.getItem(name);
        if (item) {
            const parsed = JSON.parse(item);
            return {
                ...parsed,
                state: {
                    ...parsed.state,
                    articulos: parsed.state.articulos.map(deserialize),
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
                articulos: value.state.articulos.map(serialize),
            },
        });
        sessionStorage.setItem(name, serializedState);
    },
    removeItem: (name) => sessionStorage.removeItem(name),
};

const useArticuloStore = create<ArticuloStore>()(
    persist(
        (set, get) => ({
            articulos: [],
            totalRecords: 0,
            loading: false,
            error: null,

            fetchArticulos: async () => {
                set({ loading: true, error: null });
                try {
                    const articulos = await articuloService.getAllArticulos();
                    set({ articulos, loading: false });
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        set({ error: error.message, loading: false });
                    } else {
                        set({ error: String(error), loading: false });
                    }
                }
            },

            getArticulo: (id: string) => {
                const { articulos } = get();
                return articulos.find(articulo => articulo.id === id);
            },

            createArticulo: async (articulo: Articulo) => {
                set({ loading: true, error: null });
                try {
                    await articuloService.createArticulo(articulo);
                    await get().fetchArticulos();
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        set({ error: error.message, loading: false });
                    } else {
                        set({ error: String(error), loading: false });
                    }
                }
            },

            updateArticulo: async (articulo: Articulo) => {
                set({ loading: true, error: null });
                try {
                    await articuloService.updateArticulo(articulo);
                    await get().fetchArticulos();
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        set({ error: error.message, loading: false });
                    } else {
                        set({ error: String(error), loading: false });
                    }
                }
            },

            deleteArticulo: async (id: string) => {
                set({ loading: true, error: null });
                try {
                    await articuloService.deleteArticulo(id);
                    await get().fetchArticulos();
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
                    const totalRecords = await articuloService.getTotalRecords();
                    set({ totalRecords, loading: false });
                } catch (error) {
                    set({ loading: false, error: 'Error al obtener el total de articulos' });
                    console.error(error);
                }
            },

            uploadImageForArticulo: async (articuloId: string, imageFiles: FileList) => {
                set({ loading: true, error: null });
                try {
                    Array.from(imageFiles).forEach(async (file) => {
                        await articuloService.uploadImageForArticulo(articuloId, file);
                    });
                    await get().fetchArticulos();
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        set({ error: error.message, loading: false });
                    } else {
                        set({ error: String(error), loading: false });
                    }
                }
            },

            deleteImagesForArticulo: async (articuloId: string) => {
                set({ loading: true, error: null });
                try {
                    await articuloService.deleteImagesForArticulo(articuloId);
                    await get().fetchArticulos(); // Actualizar la lista de artículos después de eliminar las imágenes
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        set({ error: error.message, loading: false });
                    } else {
                        set({ error: String(error), loading: false });
                    }
                }
            },
        }),
        {
            name: "articulos-store",
            storage,
        }
    )
);

export default useArticuloStore;
