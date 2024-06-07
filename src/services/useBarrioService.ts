import firebaseConfig from '@firebaseConfig';
import { getDocs, collection } from "firebase/firestore";
import { Barrio } from "@features/barrios/models/Barrio";
import { AutocompleteOption } from '@models/AutocompleteOption';
import FirestoreGenericService from '@services/FirestoreGenericService';

const { db } = firebaseConfig;

const COLLECTION = "BARRIOS";
const { getAllDocuments, getDocumentById, createDocument, updateDocument, deleteDocument, getTotalRecords } = FirestoreGenericService<Barrio>(COLLECTION);

const getBarrioOptions = async (): Promise<AutocompleteOption[]> => {
    const options: AutocompleteOption[] = [];
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTION));
        querySnapshot.forEach((doc) => {
            const option = {
                label: `${doc.data().nombre}`,
                value: doc.data().id
            };
            options.push(option);
        });
    } catch (error) {
        console.error("Error al obtener opciones de barrio", error);
    }
    return options;
};

export default function useBarrioService() {
    return {
        getAllBarrios: getAllDocuments,
        getBarrioById: getDocumentById,
        createBarrio: createDocument,
        updateBarrio: updateDocument,
        deleteBarrio: deleteDocument,
        getTotalRecords,
        getBarrioOptions,
    };
}