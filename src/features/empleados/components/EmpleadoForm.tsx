
import { useEffect } from 'react';
import { Button } from '@mui/material';
import BoxShadow from '@layouts/BoxShadow';
import useEmpleadoStore from '@stores/useEmpleadoStore';
import { FieldErrors, useForm } from 'react-hook-form';
import { useNavigate, useParams } from "react-router-dom";
import { Empleado } from '@features/empleados/models/Empleado';
import CustomTextField from '@components/form/CustomTextField';

const defaultValues: Empleado = {
  id: '',
  nombres: '',
  apellidos: '',
  correo: null,
  celular: '',
  direccion: '',
};

interface EmpleadoFormProps {
  isEditMode: boolean;
}

export default function EmpleadoForm({ isEditMode }: EmpleadoFormProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { createEmpleado, updateEmpleado, getEmpleado, loading, error } = useEmpleadoStore();

  const form = useForm<Empleado>({
    defaultValues: defaultValues,
    mode: "onTouched",
  });

  const { register, formState, handleSubmit, reset } = form;
  const { errors, isSubmitting, isValid } = formState;

  useEffect(() => {
    const loadEmpleado = async () => {
      if (isEditMode && id) {
        try {
          const Empleado = await getEmpleado(id);
          if (Empleado) {
            reset({
              ...Empleado
            });
          }
        } catch (error) {
          console.error("Error loading Empleado:", error);
        }
      }
    };

    loadEmpleado();
  }, [isEditMode, id, reset, getEmpleado]);

  const onSubmit = async (Empleado: Empleado) => {
    const updatedEmpleado = { ...Empleado };

    if (isEditMode) {
      await updateEmpleado(updatedEmpleado);
    } else {
      await createEmpleado(updatedEmpleado);
    }

    navigate("/empleados");
  };

  const onError = (errors: FieldErrors<any>) => {
    console.log({ errors });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <BoxShadow>
      <header className='mb-4 d-flex justify-content-between align-items-center'>
        <h2>{isEditMode ? 'Editar empleado' : 'Nuevo empleado'}</h2>
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
