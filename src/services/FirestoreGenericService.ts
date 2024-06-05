import { v4 as createUuid } from 'uuid';
import firebaseConfig from '@firebaseConfig';
import useNotification from '@services/useNotificationService';
import { ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { doc, getDocs, getDoc, setDoc, collection, runTransaction, deleteDoc } from "firebase/firestore";

const { db, storage } = firebaseConfig;

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

    const createDocument = async (document: T & { id?: string }, imageFiles?: FileList) => {
        try {
            if (!document.id) {
                document.id = createUuid();
            }
            if (imageFiles) {
                await uploadImagesForDocument(document.id, imageFiles);
            }
            await setDoc(doc(db, COLLECTION, document.id), document);
            toastSuccess("Documento creado exitosamente!");
        } catch (error) {
            toastError(error, `Error al crear documento en ${COLLECTION}`);
        }
    };

    const updateDocument = async (document: T & { id: string }, imageFiles?: FileList) => {
        const docRef = doc(db, COLLECTION, document.id);
        try {
            await runTransaction(db, async (transaction) => {
                const sfDoc = await transaction.get(docRef);
                if (!sfDoc.exists()) {
                    throw new Error(`No existe el documento que quiere editar en ${COLLECTION}`);
                }
                if (imageFiles) {
                    await deleteImagesForDocument(document.id);
                    await uploadImagesForDocument(document.id, imageFiles);
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
            await deleteImagesForDocument(id);
            const docRef = doc(db, COLLECTION, id);
            await deleteDoc(docRef);
            toastSuccess("Documento eliminado exitosamente!");
        } catch (error) {
            toastError(error, `Error al eliminar documento en ${COLLECTION}`);
        }
    };

    const uploadImagesForDocument = async (documentId: string, imageFiles: FileList) => {
        Array.from(imageFiles).forEach(async (file) => {
            const storageRef = ref(storage, `${COLLECTION}/${documentId}/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            try {
                const snapshot = await uploadTask;
                const downloadURL = await getDownloadURL(snapshot.ref);

                // Verificar si la propiedad imagenURLs existe en el documento
                const documentRef = doc(db, COLLECTION, documentId);
                const documentSnapshot = await getDoc(documentRef);
                if (documentSnapshot.exists()) {
                    const documentData = documentSnapshot.data() as { imagenURLs?: string[] };
                    if (!documentData.imagenURLs) {
                        throw new Error(`La propiedad 'imagenURLs' no está definida en el documento`);
                    }

                    // Aquí podrías guardar la URL de descarga en la propiedad imagenURLs
                    documentData.imagenURLs.push(downloadURL);
                    await setDoc(documentRef, { imagenURLs: documentData.imagenURLs }, { merge: true });
                } else {
                    throw new Error(`No se encontró el documento con ID ${documentId}`);
                }
            } catch (error) {
                console.error("Error al cargar la imagen:", error);
            }
        });
    };

    const deleteImagesForDocument = async (documentId: string) => {
        try {
            const imagesRef = ref(storage, `${COLLECTION}/${documentId}`);
            const imageList = await listAll(imagesRef);
            imageList.items.forEach(async (imageRef) => {
                await deleteObject(imageRef);
            });
        } catch (error) {
            console.error("Error al eliminar imágenes del documento:", error);
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
