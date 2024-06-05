import db from '@firebaseConfig';
import { getDocs, collection } from "firebase/firestore";
import { Empleado } from "@features/empleados/models/Empleado";
import { AutocompleteOption } from '@models/AutocompleteOption';
import FirestoreGenericService from '@services/FirestoreGenericService';

const COLLECTION = "EMPLEADOS";
const { getAllDocuments, getDocumentById, createDocument, updateDocument, deleteDocument, getTotalRecords } = FirestoreGenericService<Empleado>(COLLECTION);

const getEmpleadoOptions = async (): Promise<AutocompleteOption[]> => {
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
        console.error("Error al obtener opciones de empleado", error);
    }
    return options;
};

export default function useEmpleadoService() {
    return {
        getAllEmpleados: getAllDocuments,
        getEmpleadoById: getDocumentById,
        createEmpleado: createDocument,
        updateEmpleado: updateDocument,
        deleteEmpleado: deleteDocument,
        getTotalRecords,
        getEmpleadoOptions,
    };
}
