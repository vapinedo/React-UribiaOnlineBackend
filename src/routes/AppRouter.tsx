import Navbar from "@components/Navbar";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import Breadcrumbs from "@components/Breadcrumbs";
import NotFoundPage from "@components/NotFoundPage";
import PrivateRoute from "@app/routes/PrivateRoute";
import useAuthService from "@services/useAuthService";
import React, { useEffect, useState, lazy, Suspense } from "react";

const LoginPage = lazy(()=> import("@features/auth/pages/LoginPage"));
const ClientesRouter = lazy(()=> import("@features/clientes/ClientesRouter"));
const PrestamosRouter = lazy(()=> import("@features/prestamos/PrestamosRouter"));
const EmpleadosRouter = lazy(()=> import("@features/empleados/EmpleadosRouter"));
const DashboardPage = lazy(()=> import("@features/dashboard/pages/DashboardPage"));

export default function AppRouter() {
    const { user } = useAuthService();
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    useEffect(() => {
        setIsAuthChecked(true);
    }, [user]);

    return (
        <React.Fragment>
            {isAuthChecked && user && <Navbar /> }

            <section className="container-fluid mt-5 mb-5 px-5">
                {isAuthChecked && user && <Toaster />}
                {isAuthChecked && user &&  <Breadcrumbs />}
                
                <Suspense fallback={<div>Cargando...</div>}>
                    <Routes>
                        {/* public routes */}
                        <Route path="/login" element={<LoginPage />} />
                        
                        {/* private routes */}
                        <Route path="/" element={<PrivateRoute Component={DashboardPage} />} />
                        <Route path="/clientes/*" element={<PrivateRoute Component={ClientesRouter} />} />
                        <Route path="/empleados/*" element={<PrivateRoute Component={EmpleadosRouter} />} />
                        <Route path="/prestamos/*" element={<PrivateRoute Component={PrestamosRouter} />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </Suspense>
            </section>
        </React.Fragment>
    );
}
