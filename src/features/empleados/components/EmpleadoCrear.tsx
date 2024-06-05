import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from '@mui/material';
import { yupResolver } from "@hookform/resolvers/yup";
import { FieldErrors, useForm } from 'react-hook-form';
import useEmpleadoStore from "@app/stores/useEmpleadoStore";
import { Empleado } from '@features/empleados/models/Empleado';
import CustomTextField from '@components/form/CustomTextField';

const defaultValues: Empleado = {
    id: null,
    nombres: "",
    apellidos: "",
    correo: null,
    celular: "",
    direccion: "",
};

const validationSchema = Yup.object().shape({
    nombres: Yup
        .string()
        .required("Nombres es requerido"),
    apellidos: Yup
        .string()
        .required("Apellidos es requerido"),
    correo: Yup
        .string()
        .notRequired(),
    celular: Yup
        .string()
        .required("Celular es requerido"),
    direccion: Yup
        .string()
        .required("Dirección es requerido"),
});

export default function EmpleadoCrear() {
    const navigate = useNavigate();
    const { createEmpleado, loading, error } = useEmpleadoStore();

    const form = useForm<Empleado>({
        defaultValues,
        mode: "onTouched",
        resolver: yupResolver(validationSchema),
    });

    const { register, formState, handleSubmit } = form;
    const { errors, isValid } = formState;

    const onSubmit = async (empleado: Empleado) => {
        await createEmpleado(empleado);
        navigate("/empleados");
    };

    const onError = (errors: FieldErrors<any>) => {
        console.log({ errors });
    };

    return (
        <section>
            <header className='mb-4 d-flex justify-content-between align-items-center'>
                <Typography variant="h4">Nuevo empleado</Typography>
            </header>

            {loading ? (
                <p>Cargando formulario...</p>
            ) : error ? (
                <p>Error al cargar formulario: {error}</p>
            ) : (
                <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
                    <div className="row">
                        <div className="col-md-8 mb-3">
                            <CustomTextField
                                autoFocus
                                type="text"
                                name="nombres"
                                label="Nombres"
                                register={register("nombres")}
                                error={errors.nombres?.message}
                            />
                        </div>

                        <div className="col-md-8 mb-3">
                            <CustomTextField
                                type="text"
                                name="apellidos"
                                label="Apellidos"
                                register={register("apellidos")}
                                error={errors.apellidos?.message}
                            />
                        </div>

                        <div className="col-md-8 mb-3">
                            <CustomTextField
                                type="text"
                                name="correo"
                                label="Correo"
                                register={register("correo")}
                                error={errors.correo?.message}
                            />
                        </div>

                        <div className="col-md-8 mb-3">
                            <CustomTextField
                                type="text"
                                name="celular"
                                label="Celular"
                                register={register("celular")}
                                error={errors.celular?.message}
                            />
                        </div>

                        <div className="col-md-8 mb-3">
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
                        disabled={!isValid || loading}
                        sx={{ marginTop: 2 }}
                    >
                        Guardar
                    </Button>
                </form>
            )}  
        </section>
    );
}
