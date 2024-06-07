import BoxShadow from '@app/layouts/BoxShadow';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Datos de ejemplo
const data = [
  { name: 'Enero', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Febrero', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Marzo', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Abril', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Mayo', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Junio', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Julio', uv: 3490, pv: 4300, amt: 2100 },
];

const CustomBarChart = () => {
  return (
    <BoxShadow>
      <h4 className='text-muted mb-4 text-center'>Comparativa clientes 2023 vs 2024</h4>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" fill="#8884d8" />
          <Bar dataKey="uv" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </BoxShadow>
  );
}

export default CustomBarChart;
