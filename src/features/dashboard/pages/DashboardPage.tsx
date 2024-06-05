import { useEffect } from "react";
import IconSVG from "@components/IconSVG";
import useDashboardStore from "@stores/useDashboardStore";
import MiniCard from "@features/dashboard/components/MiniCard";
import CustomPieChart from "@features/dashboard/components/CustomPieChart";
import CustomBarChart from "@features/dashboard/components/CustomBarChart";
import CustomAreaChart from "@features/dashboard/components/CustomAreaChart";
// import CustomLineChart from "@features/dashboard/components/CustomLineChart";

export default function DashboardPage() {
    const { totalClientes, totalEmpleados, totalPrestamos, loading, error, fetchTotals } = useDashboardStore();

    useEffect(() => {
        fetchTotals();
    }, []);

    return (
        <section>
            <div className="row">
                <div className="col-md-4">
                    <MiniCard
                        title="Clientes"
                        icon={<IconSVG width="32" height="32" />}
                        data={loading ? '...' : error ? 'Error' : totalClientes}
                    />
                </div>

                <div className="col-md-4">
                    <MiniCard
                        title="Empleados"
                        icon={<IconSVG width="32" height="32" />}
                        data={loading ? '...' : error ? 'Error' : totalEmpleados}
                    />
                </div>

                <div className="col-md-4">
                    <MiniCard
                        title="Prestamos"
                        icon={<IconSVG width="32" height="32" />}
                        data={loading ? '...' : error ? 'Error' : totalPrestamos}
                    />
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-md-5">
                    <CustomAreaChart />
                </div>

                <div className="col-md-4">
                    <CustomBarChart />
                </div>

                <div className="col-md-3">
                    <CustomPieChart />
                </div>
            </div>
        </section>
    );
}
