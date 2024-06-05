import { useEffect } from 'react';
import { Button } from '@mui/material';
import BoxShadow from '@layouts/BoxShadow';
import useClienteStore from '@stores/useClienteStore';
import { FieldErrors, useForm } from 'react-hook-form';
import { useNavigate, useParams } from "react-router-dom";
import { Cliente } from '@features/clientes/models/Cliente';
import CustomTextField from '@components/form/CustomTextField';

const defaultValues: Cliente = {
  id: '',
  nombres: '',
  apellidos: '',
  correo: null,
  celular: '',
  direccion: '',
};

interface ClienteFormProps {
  isEditMode: boolean;
}

export default function ClienteForm({ isEditMode }: ClienteFormProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { createCliente, updateCliente, getCliente, loading, error } = useClienteStore();

  const form = useForm<Cliente>({
    defaultValues: defaultValues,
    mode: "onTouched",
  });

  const { register, formState, handleSubmit, reset } = form;
  const { errors, isSubmitting, isValid } = formState;

  useEffect(() => {
    const loadCliente = async () => {
      if (isEditMode && id) {
        try {
          const cliente = await getCliente(id);
          if (cliente) {
            reset({
              ...cliente
            });
          }
        } catch (error) {
          console.error("Error loading cliente:", error);
        }
      }
    };

    loadCliente();
  }, [isEditMode, id, reset, getCliente]);

  const onSubmit = async (cliente: Cliente) => {
    const updatedCliente = { ...cliente };

    if (isEditMode) {
      await updateCliente(updatedCliente);
    } else {
      await createCliente(updatedCliente);
    }

    navigate("/clientes");
  };

  const onError = (errors: FieldErrors<any>) => {
    console.log({ errors });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <BoxShadow>
      <header className='mb-4 d-flex justify-content-between align-items-center'>
        <h2>{isEditMode ? 'Editar cliente' : 'Nuevo cliente'}</h2>
      </header>

      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <div className="row">
          <div className="col-md-12 mb-3">
            <CustomTextField
              autoFocus
              type="text"
              name="nombres"
              label="Nombres"
              register={register("nombres")}
              error={errors.nombres?.message}
            />
          </div>

          <div className="col-md-12 mb-3">
            <CustomTextField
              type="text"
              name="apellidos"
              label="Apellidos"
              register={register("apellidos")}
              error={errors.apellidos?.message}
            />
          </div>

          <div className="col-md-12 mb-3">
            <CustomTextField
              type="text"
              name="correo"
              label="Correo"
              register={register("correo")}
              error={errors.correo?.message}
            />
          </div>

          <div className="col-md-12 mb-3">
            <CustomTextField
              type="text"
              name="celular"
              label="Celular"
              register={register("celular")}
              error={errors.celular?.message}
            />
          </div>

          <div className="col-md-12 mb-3">
            <CustomTextField
              type="text"
              name="direccion"
              label="Dirección"
              register={register("direccion")}
              error={errors.direccion?.message}
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="contained"
          sx={{ marginTop: 2 }}
          disabled={isSubmitting || !isValid}
          color={isEditMode ? 'success' : 'primary'}>
          {isEditMode ? 'Actualizar' : 'Guardar'}
        </Button>
      </form>
    </BoxShadow>
  );
}
