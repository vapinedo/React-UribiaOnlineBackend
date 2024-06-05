import { useEffect } from 'react';
import { Button } from '@mui/material';
import BoxShadow from '@layouts/BoxShadow';
import useBarrioStore from '@stores/useBarrioStore';
import { FieldErrors, useForm } from 'react-hook-form';
import { Barrio } from '@features/barrios/models/Barrio';
import { useNavigate, useParams } from "react-router-dom";
import CustomTextField from '@components/form/CustomTextField';

const defaultValues: Barrio = {
  id: '',
  nombre: '',
};

interface BarrioFormProps {
  isEditMode: boolean;
}

export default function BarrioForm({ isEditMode }: BarrioFormProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { createBarrio, updateBarrio, getBarrio, loading, error } = useBarrioStore();

  const form = useForm<Barrio>({
    defaultValues: defaultValues,
    mode: "onTouched",
  });

  const { register, formState, handleSubmit, reset } = form;
  const { errors, isSubmitting, isValid } = formState;

  useEffect(() => {
    const loadBarrio = async () => {
      if (isEditMode && id) {
        try {
          const barrio = await getBarrio(id);
          if (barrio) {
            reset({
              ...barrio
            });
          }
        } catch (error) {
          console.error("Error loading barrio:", error);
        }
      }
    };

    loadBarrio();
  }, [isEditMode, id, reset, getBarrio]);

  const onSubmit = async (barrio: Barrio) => {
    const updatedBarrio = { ...barrio };

    if (isEditMode) {
      await updateBarrio(updatedBarrio);
    } else {
      await createBarrio(updatedBarrio);
    }

    navigate("/barrios");
  };

  const onError = (errors: FieldErrors<any>) => {
    console.log({ errors });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <BoxShadow>
      <header className='mb-4 d-flex justify-content-between align-items-center'>
        <h2>{isEditMode ? 'Editar Barrio' : 'Nuevo Barrio'}</h2>
      </header>

      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <div className="row">
          <div className="col-md-12 mb-3">
            <CustomTextField
              autoFocus
              type="text"
              name="nombre"
              label="Nombre"
              register={register("nombre")}
              error={errors.nombre?.message}
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
