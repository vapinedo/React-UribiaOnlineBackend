import { Route, Routes } from 'react-router-dom';
import ClienteForm from '@features/clientes/components/ClienteForm';
import ClientesAdminPage from "@features/clientes/pages/ClientesAdminPage";
import ClienteDetailsPage from "@features/clientes/pages/ClienteDetailsPage";

export default function ClientesRouter() {
    return (
        <Routes>
            <Route path="/" element={<ClientesAdminPage />} />
            <Route path="/nuevo" element={<ClienteForm isEditMode={false} />} />
            <Route path="/editar/:id" element={<ClienteForm isEditMode={true} />} />
            <Route path="/detalles/:id" element={<ClienteDetailsPage />} />
        </Routes>
    )
}