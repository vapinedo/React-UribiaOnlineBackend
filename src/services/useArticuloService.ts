import { Articulo } from "@features/articulos/models/Articulo";
import { DocumentReference, getDoc } from "firebase/firestore";
import FirestoreGenericService from '@services/FirestoreGenericService';

const COLLECTION = "ARTICULOS";
const { getAllDocuments, getDocumentById, createDocument, updateDocument, deleteDocument, getTotalRecords } = FirestoreGenericService<Articulo>(COLLECTION);

const getBarrioData = async (articulo: Articulo) => {
    const barrioData = (await getDoc(articulo.barrioRef as DocumentReference)).data();
    return { barrioData };
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
    };
}