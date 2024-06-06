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

    const createDocument = async (document: T & { id?: string }, imageFiles: FileList | null) => {
        try {
            if (!document.id) {
                document.id = createUuid();
            }
            
            let imageUrls: string[] = [];
            if (imageFiles) {
                imageUrls = await uploadImagesForDocument(document.id, imageFiles);
                if (!('imagenURLs' in document)) {
                    (document as any).imagenURLs = [];  // Asignar un arreglo vacío si no existe
                }
                (document as any).imagenURLs = imageUrls;  // Tipo de aserción con `any`
            }
    
            await setDoc(doc(db, COLLECTION, document.id), document);
            toastSuccess("Documento creado exitosamente!");
        } catch (error) {
            toastError(error, `Error al crear documento en ${COLLECTION}`);
        }
    };

    const updateDocument = async (document: T & { id: string }, imageFiles: FileList | null) => {
        const docRef = doc(db, COLLECTION, document.id);
        try {
            await runTransaction(db, async (transaction) => {
                const sfDoc = await transaction.get(docRef);
                if (!sfDoc.exists()) {
                    throw new Error(`No existe el documento que quiere editar en ${COLLECTION}`);
                }
    
                let imageUrls: string[] = [];
                if (imageFiles) {
                    await deleteImagesForDocument(document.id);
                    imageUrls = await uploadImagesForDocument(document.id, imageFiles);
                    
                    if (!('imagenURLs' in document)) {
                        (document as any).imagenURLs = [];  // Asignar un arreglo vacío si no existe
                    }
                    (document as any).imagenURLs = imageUrls;  // Tipo de aserción con `any`
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

    const uploadImagesForDocument = async (documentId: string, imageFiles: FileList): Promise<string[]> => {
        const imageUrls: string[] = [];
    
        const uploadPromises = Array.from(imageFiles).map(async (file) => {
            const storageRef = ref(storage, `${COLLECTION}/${documentId}/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
    
            try {
                await uploadTask;
                const downloadURL = await getDownloadURL(storageRef);
                imageUrls.push(downloadURL);
            } catch (error) {
                console.error("Error al cargar la imagen:", error);
            }
        });
    
        await Promise.all(uploadPromises);
        return imageUrls;
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
