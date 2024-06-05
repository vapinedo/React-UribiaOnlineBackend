import { useEffect } from 'react';
import { Box } from '@mui/material';
import BoxShadow from '@layouts/BoxShadow';
import { NavLink, useNavigate } from 'react-router-dom';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import useClienteStore from '@app/stores/useClienteStore';
import useNotification from '@services/useNotificationService';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';

export default function ClientesAdminPage() {
  const navigate = useNavigate();
  const { dialogConfirm } = useNotification();

  const {
    clientes,
    loading,
    error,
    fetchClientes: getAllClientes,
    deleteCliente,
  } = useClienteStore();

  useEffect(() => {
    getAllClientes(); // Cargar clientes al montar el componente
  }, [getAllClientes]);

  const handleDetails = (params: any) => (
    <NavLink
      title="Ver detalles"
      className="grid-table-linkable-column"
      to={`/clientes/detalles/${params.id}`}
    >
      {params.formattedValue}
    </NavLink>
  );

  const handleActions = (params: any) => (
    <>
      <IconEdit
        color="#00abfb"
        cursor="pointer"
        onClick={() => navigate(`/clientes/editar/${params.id}`)}
      />
      <IconTrash
        color="#ff2825"
        cursor="pointer"
        style={{ marginLeft: 15 }}
        onClick={() => handleDelete(params)}
      />
    </>
  );

  const handleDelete = async (params: any) => {
    const text = `Vas a eliminar a ${params.row.nombres} ${params.row.apellidos}`;
    const { isConfirmed } = await dialogConfirm(text);
    if (isConfirmed) {
      deleteCliente(params.row.id);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'nombres',
      headerName: 'Nombre',
      width: 150,
      editable: true,
      renderCell: handleDetails,
    },
    {
      field: 'apellidos',
      headerName: 'Apellidos',
      width: 150,
      editable: true,
    },
    {
      field: 'correo',
      headerName: 'Correo',
      width: 110,
      editable: true,
    },
    {
      field: 'celular',
      headerName: 'Celular',
      width: 110,
      editable: true,
    },
    {
      field: 'direccion',
      headerName: 'Dirección',
      width: 280,
      editable: true,
    },
    {
      field: 'Acciones',
      renderCell: handleActions,
    },
  ];

  return (
    <BoxShadow>
      <header className="d-flex justify-content-between align-items-center">
        <h2>Lista de Clientes</h2>
        <button onClick={() => navigate('/clientes/nuevo')} className="btn btn-primary">
          Crear cliente
        </button>
      </header>

      <Box sx={{ height: '100%', width: '100%', marginTop: 3 }}>
        {loading ? (
          <p>Cargando clientes...</p>
        ) : error ? (
          <p>Ocurrió un error al cargar los clientes.</p>
        ) : (
          <DataGrid
            pagination
            rows={clientes}
            columns={columns}
            density="compact"
            checkboxSelection
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            pageSizeOptions={[10, 25, 50, 100]}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
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
        )}
      </Box>

    </BoxShadow>
  );
}
