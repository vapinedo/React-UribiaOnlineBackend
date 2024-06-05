import * as yup from 'yup';

const PrestamoFormSchema = yup.object().shape({
    clienteRef: yup.object().nullable().required('Cliente es requerido'),
    empleadoRef: yup.object().nullable().required('Empleado es requerido'),
    monto_prestado: yup
        .string()
        .test('required', 'Monto es requerido', value => value && value.trim() !== '')
        .test('numeric', 'El monto debe contener solo caracteres numéricos', value => /^[0-9]+(\.[0-9]+)?(,[0-9]+)?$/.test(value?.trim()?.replace(/\./g, '')))
        .nullable(),
    interes: yup.number().nullable().positive('El interés debe ser mayor que cero'),
    modalidadDePago: yup.string().required('Modalidad de pago es requerida'),
    estado: yup.string().required('Estado es requerido'),
    fechaInicio: yup.number().required('Fecha de inicio es requerida'),
    fechaFinal: yup.number().required('Fecha límite es requerida').min(yup.ref('fechaInicio'), 'La fecha límite debe ser posterior a la fecha de inicio')
});

export default PrestamoFormSchema;