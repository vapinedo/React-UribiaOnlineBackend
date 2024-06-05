import * as yup from 'yup';

const ArticuloFormSchema = yup.object().shape({
    barrioRef: yup.object().nullable().required('Barrio es requerido'),
    estado: yup.string().required('Estado es requerido'),
});

export default ArticuloFormSchema;