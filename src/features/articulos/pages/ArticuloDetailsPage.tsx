import { useEffect, useState } from "react";
import BoxShadow from "@layouts/BoxShadow";
import { useParams } from "react-router-dom";
import { getDoc } from "firebase/firestore";
import useArticuloStore from "@stores/useArticuloStore";
import { Articulo } from "../models/Articulo";

export default function PrestamoDetailsPage() {
    const params = useParams();
    const [barrio, setBarrio] = useState<any>(null);
    const [articulo, setArticulo] = useState<Articulo | undefined>(undefined);
    const { getArticulo, loading, error } = useArticuloStore();

    useEffect(() => {
        const articuloId = params.id;
        if (articuloId) {
            const nuevoArticulo = getArticulo(articuloId);
            setArticulo(nuevoArticulo);
            if (nuevoArticulo?.barrioRef) {
                getDoc(nuevoArticulo.barrioRef).then((doc) => {
                    if (doc.exists()) {
                        setBarrio(doc.data());
                    } else {
                        console.log("No such document!");
                    }
                }).catch((error) => {
                    console.error("Error getting document:", error);
                });
            }
        }
    }, [getArticulo, params.id]);

    return (
        <BoxShadow>
            <header className="d-flex justify-content-between align-items-center">
                <h2>Detalles del articulo</h2>
            </header>

            {loading ? (
                <p>Cargando articulo...</p>
            ) : error ? (
                <p>Error al cargar articulo: {error}</p>
            ) : articulo ? (
                <div className="mt-4">
                    <div className="row">
                        <div className="col-md-12">
                            <table className="table table-striped">
                                <tbody>
                                    <tr>
                                        <th>Cliente</th>
                                        <td>{barrio?.nombres} {barrio?.apellidos}</td>
                                    </tr>
                                    <tr>
                                        <th>Nombre del articulo</th>
                                        <td>{articulo?.nombre}</td>
                                    </tr>
                                    <tr>
                                        <th>Estado articulo</th>
                                        <td>{articulo?.estadoArticulo}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <p>No se encontró articulo con ID {params.id}</p>
            )}
        </BoxShadow>
    )
}
