import { Box } from "@mui/material";
import BoxShadow from "@layouts/BoxShadow";
import { useEffect, useState } from "react";
import { getDoc } from "firebase/firestore";
import useDatetime from "@hooks/useDatetime";
import useArticulosStore from "@stores/useArticulosStore";
import { NavLink, useNavigate } from "react-router-dom";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import useNotification from '@services/useNotificationService';
import { Articulos } from "@features/articulos/models/Articulos";
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import useArticuloHelper from "@features/articulos/helpers/useArticuloHelper";

export default function ArticulosAdminPage() {
  const navigate = useNavigate();
  const { differenceInDays } = useDatetime();
  const { dialogConfirm } = useNotification();
  const { getClassByState } = useArticuloHelper();
  const { prestamos, loading, error, fetchPrestamos, deletePrestamo } = useArticulosStore();

  const [prestamosData, setPrestamosData] = useState<Articulos[]>([]);

  useEffect(() => {
    const fetchRelatedData = async () => {
      const prestamosConNombres: Articulos[] = await Promise.all(
        prestamos.map(async (prestamo) => {
          let clienteNombre = '';
          let empleadoNombre = '';

          if (prestamo.clienteRef) {
            const clienteSnapshot = await getDoc(prestamo.clienteRef);
            if (clienteSnapshot.exists()) {
              const clienteData = clienteSnapshot.data();
              if (clienteData) {
                clienteNombre = `${clienteData.nombres || ''} ${clienteData.apellidos || ''}`;
              }
            }
          }

          if (prestamo.empleadoRef) {
            const empleadoSnapshot = await getDoc(prestamo.empleadoRef);
            if (empleadoSnapshot.exists()) {
              const empleadoData = empleadoSnapshot.data();
              if (empleadoData) {
                empleadoNombre = `${empleadoData.nombres || ''} ${empleadoData.apellidos || ''}`;
              }
            }
          }

          return {
            ...prestamo,
            clienteNombre,
            empleadoNombre,
          };
        })
      );

      setPrestamosData(prestamosConNombres);
    };

    fetchRelatedData();
  }, [prestamos]);

  const handleDetails = ({ row }: any) => {
    return (
      <NavLink
        title={`Ver detalles de ${row.clienteNombre}`}
        className="grid-table-linkable-column"
        to={`/prestamos/detalles/${row.id}`}
      >
        {row.clienteNombre}
      </NavLink>
    );
  };

  const handleActions = (params: any) => {
    return (
      <>
        <IconEdit
          color="#00abfb"
          cursor="pointer"
          onClick={() => navigate(`/prestamos/editar/${params.id}`)}
        />
        <IconTrash
          color="#ff2825"
          cursor="pointer"
          style={{ marginLeft: 15 }}
          onClick={() => handleDelete(params)}
        />
      </>
    )
  };

  const handleDelete = async (params: any) => {
    const text = `Vas a eliminar un prestamo a ${params.row.clienteNombre}`;
    const { isConfirmed } = await dialogConfirm(text);
    if (isConfirmed) {
      deletePrestamo(params.row.id);
    }
  };

  const columns: GridColDef<any>[] = [
    {
      field: 'clienteNombre',
      headerName: 'Cliente',
      width: 170,
      editable: true,
      renderCell: handleDetails,
    },
    {
      field: 'empleadoNombre',
      headerName: 'Empleado',
      width: 170,
      editable: true,
      renderCell: (params) => params.value,
    },
    {
      field: 'monto_prestado',
      headerName: 'Prestado',
      width: 110,
      editable: true,
    },
    {
      field: 'monto_abonado',
      headerName: 'Abonado',
      width: 110,
      editable: true,
    },
    {
      field: 'monto_adeudado',
      headerName: 'Adeudado',
      width: 110,
      editable: true,
    },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 130,
      editable: true,
      renderCell: ({ row }) => {
        const className = getClassByState(row.estado);
        return <span className={className}>{row.estado}</span>;
      }
    },
    {
      field: 'modalidadDePago',
      headerName: 'Modo de Pago',
      width: 120,
      editable: true,
    },
    {
      field: 'fechaFinal',
      headerName: 'Días restantes',
      width: 120,
      editable: true,
      renderCell: ({ row }) => differenceInDays(row.fechaInicio, row.fechaFinal)
    },
    {
      field: " ",
      renderCell: handleActions,
    }
  ];

  useEffect(() => {
    fetchPrestamos();
  }, [fetchPrestamos]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <BoxShadow>
      <header className="d-flex justify-content-between align-items-center">
        <h2>Lista de Prestamos</h2>
        <button onClick={() => navigate('/prestamos/nuevo')} className="btn btn-primary">
          Crear prestamo
        </button>
      </header>

      <Box sx={{ height: "100%", width: '100%', marginTop: 1 }}>
        <DataGrid
          columns={columns}
          density="compact"
          checkboxSelection
          disableColumnFilter
          rows={prestamosData}
          disableColumnSelector
          pageSizeOptions={[12]}
          disableDensitySelector
          disableRowSelectionOnClick
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            }
          }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 12,
              },
            },
          }}
          sx={{
            border: "none",
            overflowX: "hidden",
            "& .css-128fb87-MuiDataGrid-toolbarContainer": {
              display: "flex",
              marginTop: "12px",
              marginBottom: "22px",
              flexDirection: "row-reverse",
            }
          }}
          localeText={{
            toolbarExport: "Exportar",
            toolbarQuickFilterPlaceholder: "Buscar...",
          }}
        />
      </Box>
    </BoxShadow>
  )
}
