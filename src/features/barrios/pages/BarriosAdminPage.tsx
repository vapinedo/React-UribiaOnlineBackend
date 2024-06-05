import { useEffect } from 'react';
import { Box } from '@mui/material';
import BoxShadow from '@layouts/BoxShadow';
import { useNavigate } from 'react-router-dom';
import useBarrioStore from '@app/stores/useBarrioStore';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import useNotification from '@services/useNotificationService';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';

export default function BarriossAdminPage() {
  const navigate = useNavigate();
  const { dialogConfirm } = useNotification();

  const {
    barrios,
    loading,
    error,
    getAllBarrios,
    deleteBarrio,
  } = useBarrioStore();

  useEffect(() => {
    getAllBarrios();
  }, [getAllBarrios]);

  const handleActions = (params: any) => (
    <>
      <IconEdit
        color="#00abfb"
        cursor="pointer"
        onClick={() => navigate(`/barrios/editar/${params.id}`)}
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
    const text = `Vas a eliminar el barrio ${params.row.nombre}`;
    const { isConfirmed } = await dialogConfirm(text);
    if (isConfirmed) {
      deleteBarrio(params.row.id);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'nombre',
      headerName: 'Nombre',
      width: 150,
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
        <h2>Lista de Barrios</h2>
        <button onClick={() => navigate('/barrios/nuevo')} className="btn btn-primary">
          Crear barrio
        </button>
      </header>

      <Box sx={{ height: '100%', width: '100%', marginTop: 3 }}>
        {loading ? (
          <p>Cargando barrios...</p>
        ) : error ? (
          <p>Ocurrió un error al cargar los barrios.</p>
        ) : (
          <DataGrid
            pagination
            rows={barrios}
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
