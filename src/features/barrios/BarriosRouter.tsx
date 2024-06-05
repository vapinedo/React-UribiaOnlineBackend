import { Route, Routes } from 'react-router-dom';
import BarrioForm from '@features/barrios/components/BarrioForm';
import BarriosAdminPage from "@features/barrios/pages/BarriosAdminPage";

export default function BarriosRouter() {
    return (
        <Routes>
            <Route path="/" element={<BarriosAdminPage />} />
            <Route path="/nuevo" element={<BarrioForm isEditMode={false} />} />
            <Route path="/editar/:id" element={<BarrioForm isEditMode={true} />} />
        </Routes>
    )
}