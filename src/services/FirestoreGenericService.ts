import db from '@firebaseConfig';
import { v4 as createUuid } from 'uuid';
import useNotification from '@services/useNotificationService';
import { doc, getDocs, getDoc, setDoc, collection, runTransaction, deleteDoc } from "firebase/firestore";

export default function FirestoreGenericService<T>(COLLECTION: string) {
    const { toastError, toastSuccess } = useNotification();

    const getAllDocuments = async (): Promise<T[]> => {
        const documents: T[] = [];
        try {
            const querySnapshot = await getDocs(collection(db, COLLECTION));
            for (const docSnapshot of querySnapshot.docs) {
                const documentData = docSnapshot.data() as T;
                documents.push(documentData);
            }
        } catch (error) {
            toastError(error, `Error al obtener los documentos de ${COLLECTION}`);
        }
        return documents;
    };

    const getDocumentById = async (id: string): Promise<T | null> => {
        let document: T | null = null;
        try {
            const docRef = doc(db, COLLECTION, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                document = docSnap.data() as T;
            }
        } catch (error) {
            toastError(error, `Error al obtener documento por ID ${id} de ${COLLECTION}`);
        }
        return document;
    };

    const createDocument = async (document: T & { id?: string }) => {
        try {
            if (!document.id) {
                document.id = createUuid();
            }
            await setDoc(doc(db, COLLECTION, document.id), document);
            toastSuccess("Documento creado exitosamente!");
        } catch (error) {
            toastError(error, `Error al crear documento en ${COLLECTION}`);
        }
    };

    const updateDocument = async (document: T & { id: string }) => {
        const docRef = doc(db, COLLECTION, document.id);
        try {
            await runTransaction(db, async (transaction) => {
                const sfDoc = await transaction.get(docRef);
                if (!sfDoc.exists()) {
                    throw new Error(`No existe el documento que quiere editar en ${COLLECTION}`);
                }
                transaction.update(docRef, { ...document });
                toastSuccess("Documento actualizado exitosamente!");
            });
        } catch (error) {
            toastError(error, `Error al actualizar documento en ${COLLECTION}`);
        }
    };

    const deleteDocument = async (id: string) => {
        try {
            const docRef = doc(db, COLLECTION, id);
            await deleteDoc(docRef);
            toastSuccess("Documento eliminado exitosamente!");
        } catch (error) {
            toastError(error, `Error al eliminar documento en ${COLLECTION}`);
        }
    };

    const getTotalRecords = async (): Promise<number> => {
        try {
            const querySnapshot = await getDocs(collection(db, COLLECTION));
            return querySnapshot.size;
        } catch (error) {
            toastError(error, `Error al obtener el total de registros de ${COLLECTION}`);
            return 0;
        }
    };

    return {
        getAllDocuments,
        getDocumentById,
        createDocument,
        updateDocument,
        deleteDocument,
        getTotalRecords,
    };
}
