import dayjs from 'dayjs';
import db from '@firebaseConfig';
import Select from '@mui/material/Select';
import BoxShadow from '@layouts/BoxShadow';
import { useEffect, useState } from 'react';
import useClienteStore from '@stores/useClienteStore';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldErrors, useForm } from 'react-hook-form';
import useEmpleadoStore from '@stores/useEmpleadoStore';
import usePrestamoStore from '@stores/usePrestamoStore';
import { useNavigate, useParams } from "react-router-dom";
import { doc, Firestore, getDoc } from 'firebase/firestore';
import { Cliente } from '@features/clientes/models/Cliente';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Prestamo } from '@features/prestamos/models/Prestamo';
import { Empleado } from '@features/empleados/models/Empleado';
import CustomTextField from '@components/form/CustomTextField';
import PrestamoFormSchema from '@features/prestamos/PrestamoFormSchema';
import CustomCurrencyInput from '@app/components/form/CustomCurrencyInput';
import usePrestamoHelper from '@features/prestamos/helpers/usePrestamoHelper';
import { estadoPrestamoOptions, modalidadDePagoOptions } from '@mocks/DropdownOptions';
import { Autocomplete, Button, FormControl, InputLabel, MenuItem, TextField } from '@mui/material';

const defaultValues: Prestamo = {
    id: '',
    interes: null,
    estado: "Activo",
    clienteRef: null,
    empleadoRef: null,
    monto_prestado: '',
    monto_abonado: '',
    monto_adeudado: '',
    modalidadDePago: "Diario",
    fechaInicio: new Date().getTime(),
    fechaFinal: dayjs(new Date()).add(30, 'day').valueOf(),
};

interface PrestamoFormProps {
    isEditMode: boolean;
}

export default function PrestamoForm({ isEditMode }: PrestamoFormProps) {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { getMontoAdeudado } = usePrestamoHelper();
    const { empleados, fetchEmpleados } = useEmpleadoStore();
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [empleado, setEmpleado] = useState<Empleado | null>(null);
    const { clientes, fetchClientes: getAllClientes } = useClienteStore();
    const { createPrestamo, updatePrestamo, getPrestamo, loading, error } = usePrestamoStore();

    const form = useForm<Prestamo>({
        defaultValues: defaultValues,
        mode: "onTouched",
        resolver: yupResolver(PrestamoFormSchema),
    });

    const { control, register, formState, handleSubmit, setValue, getValues, watch, reset } = form;
    const { errors, isSubmitting, isValid } = formState;

    useEffect(() => {
        const loadPrestamo = async () => {
            if (isEditMode && id) {
                try {
                    const prestamo = await getPrestamo(id);
                    if (prestamo) {
                        reset({
                            ...prestamo,
                            fechaInicio: dayjs(prestamo.fechaInicio).valueOf(),
                            fechaFinal: dayjs(prestamo.fechaFinal).valueOf(),
                        });
                        
                        if (prestamo.clienteRef) {
                            const clienteDoc = await getDoc(prestamo.clienteRef);
                            if (clienteDoc.exists()) {
                                setCliente(clienteDoc.data() as Cliente);
                            }
                        }
                        
                        if (prestamo.empleadoRef) {
                            const empleadoDoc = await getDoc(prestamo.empleadoRef);
                            if (empleadoDoc.exists()) {
                                setEmpleado(empleadoDoc.data() as Empleado);
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error loading prestamo:", error);
                }
            }
        };

        loadPrestamo();
    }, [isEditMode, id, reset, getPrestamo]);

    useEffect(() => {
        if (!clientes.length) {
            getAllClientes();
        }
    }, [clientes, getAllClientes]);

    useEffect(() => {
        if (!empleados.length) {
            fetchEmpleados();
        }
    }, [empleados, fetchEmpleados]);

    const handleClienteChange = (_event: any, value: Cliente & { id: string } | null) => {
        if (value && value.id) {
            const clienteRef = doc(db as Firestore, 'CLIENTES', value.id);
            setValue('clienteRef', clienteRef);
            setCliente(value);
        } else {
            setValue('clienteRef', null);
            setCliente(null);
        }
    };

    const handleEmpleadoChange = (_event: any, value: Empleado & { id: string } | null) => {
        if (value && value.id) {
            const empleadoRef = doc(db as Firestore, 'EMPLEADOS', value.id);
            setValue('empleadoRef', empleadoRef);
            setEmpleado(value);
        } else {
            setValue('empleadoRef', null);
            setEmpleado(null);
        }
    };

    const onSubmit = async (prestamo: Prestamo) => {
        const clienteRef = getValues('clienteRef');
        const empleadoRef = getValues('empleadoRef');
        const montoAdeudado = getMontoAdeudado(prestamo);
        prestamo.monto_adeudado = montoAdeudado;
        const updatedPrestamo = { ...prestamo, clienteRef, empleadoRef };

        if (isEditMode) {
            await updatePrestamo(updatedPrestamo);
        } else {
            await createPrestamo(updatedPrestamo);
        }

        navigate("/prestamos");
    };

    const onError = (errors: FieldErrors<any>) => {
        console.log({ errors });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <BoxShadow>
            <header className='mb-4 d-flex justify-content-between align-items-center'>
                <h2>{isEditMode ? 'Editar préstamo' : 'Nuevo préstamo'}</h2>
            </header>

            <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
                <div className="row">
                    <div className="col-md-6">
                        <div className="col-md-12 mb-3">
                            <Autocomplete
                                fullWidth
                                size='small'
                                value={cliente}
                                options={clientes}
                                onChange={handleClienteChange}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                renderInput={(params) => <TextField {...params} label="Cliente" />}
                                getOptionLabel={(cliente: Cliente) => `${cliente.nombres} ${cliente.apellidos}`}
                            />
                        </div>

                        <div className="col-md-12 mb-3">
                            <Autocomplete
                                fullWidth
                                size='small'
                                value={empleado}
                                options={empleados}
                                onChange={handleEmpleadoChange}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                renderInput={(params) => <TextField {...params} label="Empleado" />}
                                getOptionLabel={(empleado: Empleado) => `${empleado.nombres} ${empleado.apellidos}`}
                            />
                        </div>

                        <div className="col-md-12 mb-3">
                            <CustomCurrencyInput
                                size='small'
                                control={control}
                                name="monto_prestado"
                                label="Monto prestado"
                                helperText={errors.monto_prestado?.message}
                            />                        
                        </div>

                        <div className="col-md-12 mb-3">
                            <CustomTextField
                                type="text"
                                size='small'
                                name="interes"
                                label="Interés"
                                register={register("interes")}
                                error={errors.interes?.message}
                            />
                        </div>

                        <div className="col-md-12 mb-3">
                            <CustomCurrencyInput
                                size='small'
                                control={control}
                                name="monto_abonado"
                                label="Monto abonado"
                                helperText={errors.monto_abonado?.message}
                            />                        
                        </div>                       
                    </div>

                    <div className="col-md-6">
                        <div className="col-md-12 mb-3">
                            <CustomCurrencyInput
                                disabled
                                size='small'
                                control={control}
                                name="monto_adeudado"
                                label="Monto adeudado"
                                helperText={errors.monto_adeudado?.message}
                            />                        
                        </div> 

                        <div className="col-md-12 mb-3">
                            <FormControl fullWidth>
                                <InputLabel>Modalidad de pago</InputLabel>
                                <Select
                                    size='small'
                                    label="Modalidad de pago"
                                    value={watch('modalidadDePago')}
                                    onChange={(event) => setValue('modalidadDePago', event.target.value)}
                                >
                                    {modalidadDePagoOptions.map((modalidad: string) => (
                                        <MenuItem key={modalidad} value={modalidad}>{modalidad}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        <div className="col-md-12 mb-3">
                            <FormControl fullWidth>
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    size='small'
                                    label="Estado"
                                    value={watch('estado')}
                                    onChange={(event) => setValue('estado', event.target.value)}
                                >
                                    {estadoPrestamoOptions.map((estado: string) => (
                                        <MenuItem key={estado} value={estado}>{estado}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        <div className="col-md-12 mb-3">
                            <DatePicker
                                name="fechaInicio"
                                sx={{ width: "100%" }}
                                label="Fecha de inicio"
                                defaultValue={dayjs(new Date())}
                                value={dayjs(form.getValues("fechaInicio"))}
                                slotProps={{ textField: { size: 'small' } }}
                                onChange={(newDate) => {
                                    const timeStamp = dayjs(newDate).valueOf();
                                    setValue('fechaInicio', timeStamp);
                                }}
                            />
                        </div>

                        <div className="col-md-12 mb-3">
                            <DatePicker
                                name="fechaFinal"
                                sx={{ width: "100%" }}
                                label="Fecha de finalización"
                                value={dayjs(form.getValues("fechaFinal"))}
                                slotProps={{ textField: { size: 'small' } }}
                                onChange={(newDate) => {
                                    const timeStamp = dayjs(newDate).valueOf();
                                    setValue('fechaFinal', timeStamp);
                                }}
                            />
                        </div>
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
