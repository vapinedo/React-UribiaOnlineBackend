import { Articulo } from "@features/articulos/models/Articulo";
import { DocumentReference, getDoc } from "firebase/firestore";
import FirestoreGenericService from '@services/FirestoreGenericService';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import firebaseConfig from "@firebaseConfig";

const COLLECTION = "ARTICULOS";
const { getAllDocuments, getDocumentById, createDocument, updateDocument, deleteDocument, getTotalRecords } = FirestoreGenericService<Articulo>(COLLECTION);

const storage = firebaseConfig.storage;

const getBarrioData = async (articulo: Articulo) => {
    const barrioData = (await getDoc(articulo.barrioRef as DocumentReference)).data();
    return { barrioData };
};

const uploadImageForArticulo = async (articuloId: string, imageFile: File) => {
    const storageRef = ref(storage, `articulo_images/${articuloId}/${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    try {
        const snapshot = await uploadTask;
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    } catch (error) {
        console.error("Error al cargar la imagen:", error);
        throw error;
    }
};

const deleteImagesForArticulo = async (articuloId: string) => {
    // Obtener las URL de las imágenes asociadas al artículo
    const articulo = await getDocumentById(articuloId);
    if (!articulo || !articulo.imagenURLs || articulo.imagenURLs.length === 0) {
        throw new Error("No hay imágenes asociadas al artículo.");
    }

    // Eliminar cada imagen del Storage
    const promises = articulo.imagenURLs.map(async (imageUrl) => {
        const imagePath = imageUrl.split(storage.ref().location.bucket)[1];
        const imageRef = ref(storage, imagePath);
        try {
            await deleteObject(imageRef);
        } catch (error) {
            console.error("Error al eliminar la imagen:", error);
            throw error;
        }
    });

    // Esperar a que se completen todas las eliminaciones
    try {
        await Promise.all(promises);
    } catch (error) {
        console.error("Error al eliminar las imágenes del artículo:", error);
        throw error;
    }
};

export default function useArticuloService() {
    return {
        getAllArticulos: getAllDocuments,
        getArticuloById: getDocumentById,
        createArticulo: createDocument,
        updateArticulo: updateDocument,
        deleteArticulo: deleteDocument,
        getTotalRecords,
        getBarrioData,
        uploadImageForArticulo,
        deleteImagesForArticulo,
    };
}
