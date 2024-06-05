import { Route, Routes } from 'react-router-dom';
import ArticuloForm from '@features/articulos/components/ArticuloForm';
import ArticulosAdminPage from "@app/features/articulos/pages/ArticulosAdminPage";
import ArticuloDetailsPage from "@features/articulos/pages/ArticuloDetailsPage";

export default function ArticulosRouter() {
    return (
        <Routes>
            <Route path="/" element={<ArticulosAdminPage />} />
            <Route path="/nuevo" element={<ArticuloForm isEditMode={false} />} />
            <Route path="/editar/:id" element={<ArticuloForm isEditMode={true} />} />
            <Route path="/detalles/:id" element={<ArticuloDetailsPage />} />
        </Routes>
    )
}
