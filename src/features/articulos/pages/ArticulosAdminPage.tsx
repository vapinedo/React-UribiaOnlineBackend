import { Box } from "@mui/material";
import BoxShadow from "@layouts/BoxShadow";
import { useEffect, useState } from "react";
import { getDoc } from "firebase/firestore";
import useDatetime from "@hooks/useDatetime";
import { NavLink, useNavigate } from "react-router-dom";
import useArticulosStore from "@stores/useArticuloStore";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import useNotification from '@services/useNotificationService';
import { Articulo } from "@features/articulos/models/Articulo";
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import useArticuloHelper from "@features/articulos/helpers/useArticuloHelper";

export default function ArticulosAdminPage() {
  const navigate = useNavigate();
  const { dialogConfirm } = useNotification();
  const { getClassByState } = useArticuloHelper();
  const [articulosData, setArticulosData] = useState<Articulo[]>([]);
  const { articulos, loading, error, fetchArticulos, deleteArticulo } = useArticulosStore();

  useEffect(() => {
    const fetchRelatedData = async () => {
      const articulosConNombre: Articulo[] = await Promise.all(
        articulos.map(async (articulo) => {
          let barrioNombre = '';

          if (articulo.barrioRef) {
            const barrioSnapshot = await getDoc(articulo.barrioRef);
            if (barrioSnapshot.exists()) {
              const barrioData = barrioSnapshot.data();
              if (barrioData) {
                barrioNombre = `${barrioData.nombre || ''}`;
              }
            }
          }

          return {
            ...articulo,
            barrioNombre,
          };
        })
      );

      setArticulosData(articulosConNombre);
    };

    fetchRelatedData();
  }, [articulos]);

  const handleDetails = ({ row }: any) => {
    return (
      <NavLink
        title={`Ver detalles de ${row.barrioNombre}`}
        className="grid-table-linkable-column"
        to={`/articulos/detalles/${row.id}`}
      >
        {row.barrioNombre}
      </NavLink>
    );
  };

  const handleActions = (params: any) => {
    return (
      <>
        <IconEdit
          color="#00abfb"
          cursor="pointer"
          onClick={() => navigate(`/articulos/editar/${params.id}`)}
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
    // const text = `Vas a eliminar un articulo a ${params.row.barrioNombre}`;
    // const { isConfirmed } = await dialogConfirm(text);
    // if (isConfirmed) {
    //   deleteArticulo(params.row.id);
    // }
  };

  const columns: GridColDef<any>[] = [
    {
      field: 'barrioNombre',
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
      field: 'precio',
      headerName: 'Precio',
      width: 110,
      editable: true,
    },
    {
      field: 'estadoArticulo',
      headerName: 'Estado Articulo',
      width: 130,
      editable: true,
      renderCell: ({ row }) => {
        const className = getClassByState(row.estadoArticulo);
        return <span className={className}>{row.estadoArticulo}</span>;
      }
    },
    {
      field: " ",
      renderCell: handleActions,
    }
  ];

  useEffect(() => {
    fetchArticulos();
  }, [fetchArticulos]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <BoxShadow>
      <header className="d-flex justify-content-between align-items-center">
        <h2>Lista de Articulos</h2>
        <button onClick={() => navigate('/articulos/nuevo')} className="btn btn-primary">
          Crear articulo
        </button>
      </header>

      <Box sx={{ height: "100%", width: '100%', marginTop: 1 }}>
        <DataGrid
          columns={columns}
          density="compact"
          checkboxSelection
          disableColumnFilter
          rows={articulosData}
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
