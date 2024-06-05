import * as yup from 'yup';

const ArticuloFormSchema = yup.object().shape({
    nombre: yup.string().required('Nombre es requerido'),
    barrioRef: yup.object().nullable().required('Barrio es requerido'),
});

export default ArticuloFormSchema;