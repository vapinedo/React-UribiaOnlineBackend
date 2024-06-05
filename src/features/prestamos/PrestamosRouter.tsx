import { Route, Routes } from 'react-router-dom';
import PrestamoForm from '@features/prestamos/components/PrestamoForm';
import PrestamosAdminPage from "@features/prestamos/pages/PrestamoAdminPage";
import PrestamoDetailsPage from "@features/prestamos/pages/PrestamoDetailsPage";

export default function PrestamosRouter() {
    return (
        <Routes>
            <Route path="/" element={<PrestamosAdminPage />} />
            <Route path="/nuevo" element={<PrestamoForm isEditMode={false} />} />
            <Route path="/editar/:id" element={<PrestamoForm isEditMode={true} />} />
            <Route path="/detalles/:id" element={<PrestamoDetailsPage />} />
        </Routes>
    )
}
