import db from '@firebaseConfig';
import { getDocs, collection } from "firebase/firestore";
import { Cliente } from "@features/clientes/models/Cliente";
import { AutocompleteOption } from '@models/AutocompleteOption';
import FirestoreGenericService from '@services/FirestoreGenericService';

const COLLECTION = "CLIENTES";
const { getAllDocuments, getDocumentById, createDocument, updateDocument, deleteDocument, getTotalRecords } = FirestoreGenericService<Cliente>(COLLECTION);

const getClienteOptions = async (): Promise<AutocompleteOption[]> => {
    const options: AutocompleteOption[] = [];
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTION));
        querySnapshot.forEach((doc) => {
            const option = {
                label: `${doc.data().nombres} ${doc.data().apellidos}`,
                value: doc.data().id
            };
            options.push(option);
        });
    } catch (error) {
        console.error("Error al obtener opciones de cliente", error);
    }
    return options;
};

export default function useClienteService() {
    return {
        getAllClientes: getAllDocuments,
        getClienteById: getDocumentById,
        createCliente: createDocument,
        updateCliente: updateDocument,
        deleteCliente: deleteDocument,
        getTotalRecords,
        getClienteOptions,
    };
}