import { useEffect, useState } from "react";
import BoxShadow from "@layouts/BoxShadow";
import { useParams } from "react-router-dom";
import useEmpleadoStore from "@stores/useEmpleadoStore";

export default function EmpleadoDetailsPage() {
    const params = useParams();
    const { getEmpleado, loading, error } = useEmpleadoStore();
    const [empleado, setEmpleado] = useState<any>(null);

    useEffect(() => {
        const empleadoId = params.id;
        if (empleadoId) {
            const newEmpleado = getEmpleado(empleadoId);
            setEmpleado(newEmpleado);
        }
    }, [getEmpleado, params.id]);

    return (
        <BoxShadow>
            <header className="d-flex justify-content-between align-items-center">
                <h2>Detalles del empleado</h2>
            </header>

            {loading ? (
                <p>Cargando empleado...</p>
            ) : error ? (
                <p>Error al cargar empleado: {error}</p>
            ) : empleado ? (
                <div className="mt-4">
                    <table className="table table-striped">
                        <tbody>
                            <tr>
                                <th>Nombres</th>
                                <td>{empleado.nombres}</td>
                            </tr>
                            <tr>
                                <th>Apellidos</th>
                                <td>{empleado.apellidos}</td>
                            </tr>
                            <tr>
                                <th>Celular</th>
                                <td>{empleado.celular}</td>
                            </tr>
                            <tr>
                                <th>Correo</th>
                                <td>{empleado.correo}</td>
                            </tr>
                            <tr>
                                <th>Dirección</th>
                                <td>{empleado.direccion}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No se encontró empleado con ID {params.id}</p>
            )}
        </BoxShadow>
    );
}
