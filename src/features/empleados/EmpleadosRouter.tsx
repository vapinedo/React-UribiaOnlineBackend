import { Route, Routes } from 'react-router-dom';
import EmpleadoForm from '@features/empleados/components/EmpleadoForm';
import EmpleadosAdminPage from "@features/empleados/pages/EmpleadosAdminPage";
import EmpleadoDetailsPage from "@features/empleados/pages/EmpleadoDetailsPage";

export default function EmpleadosRouter() {
    return (
        <Routes>
            <Route path="/" element={ <EmpleadosAdminPage /> } />
            <Route path="/nuevo" element={ <EmpleadoForm isEditMode={false} /> } />
            <Route path="/editar/:id" element={ <EmpleadoForm isEditMode={true} /> } />
            <Route path="/detalles/:id" element={ <EmpleadoDetailsPage /> } />
        </Routes>
    )
}