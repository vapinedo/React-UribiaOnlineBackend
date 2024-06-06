import Select from '@mui/material/Select';
import BoxShadow from '@layouts/BoxShadow';
import { useEffect, useState } from 'react';
import firebaseConfig from '@firebaseConfig';
import useBarrioStore from '@stores/useBarrioStore';
import { FieldErrors, useForm } from 'react-hook-form';
import useArticuloStore from '@stores/useArticuloStore';
import { Barrio } from '@features/barrios/models/Barrio';
import { useNavigate, useParams } from "react-router-dom";
import { doc, Firestore, getDoc } from 'firebase/firestore';
import CustomTextField from '@components/form/CustomTextField';
import { Articulo } from '@features/articulos/models/Articulo';
import CustomCurrencyInput from '@app/components/form/CustomCurrencyInput';
import { Autocomplete, Button, FormControl, InputLabel, MenuItem, TextField } from '@mui/material';
import { EstadoArticulo, EstadoPublicacion, estadoArticuloOptions, estadoPublicacionOptions } from '@mocks/DropdownOptions';

const { db } = firebaseConfig;

const defaultValues: Articulo = {
    id: '',
    nombre: '',
    precio: '',
    imagenURLs: [],
    barrioRef: null,
    descripcion: null,
    estadoArticulo: EstadoArticulo.Nuevo,
    estadoPublicacion: EstadoPublicacion.NoPublicado,
    audit: {
        updated_by: null,
        created_by: null,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
    },
};

interface ArticuloFormProps {
    isEditMode: boolean;
}

export default function ArticuloForm({ isEditMode }: ArticuloFormProps) {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { barrios, fetchBarrios } = useBarrioStore();
    const [barrio, setBarrio] = useState<Barrio | null>(null);
    const [imageFiles, setImageFiles] = useState<FileList | null>(null);
    const { createArticulo, updateArticulo, getArticulo, loading, error, uploadImageForArticulo } = useArticuloStore();

    const form = useForm<Articulo>({
        defaultValues: defaultValues,
        mode: "onTouched",
    });

    const { control, register, formState, handleSubmit, setValue, getValues, watch, reset } = form;
    const { errors, isSubmitting, isValid } = formState;

    useEffect(() => {
        const loadArticulo = async () => {
            if (isEditMode && id) {
                try {
                    const articulo = await getArticulo(id);
                    if (articulo) {
                        reset({
                            ...articulo,
                        });

                        if (articulo.barrioRef) {
                            const barrioDoc = await getDoc(articulo.barrioRef);
                            if (barrioDoc.exists()) {
                                setBarrio(barrioDoc.data() as Barrio);
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error loading articulo:", error);
                }
            }
        };

        loadArticulo();
    }, [isEditMode, id, reset, getArticulo]);

    useEffect(() => {
        if (!barrios.length) {
            fetchBarrios();
        }
    }, [barrios, fetchBarrios]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setImageFiles(event.target.files);
        }
    };

    const handleBarrioChange = (_event: any, value: Barrio & { id: string } | null) => {
        if (value && value.id) {
            const barrioRef = doc(db as Firestore, 'BARRIOS', value.id);
            setValue('barrioRef', barrioRef);
            setBarrio(value);
        } else {
            setValue('barrioRef', null);
            setBarrio(null);
        }
    };

    const onSubmit = async (articulo: Articulo) => {
        const barrioRef = getValues('barrioRef');
        const updatedArticulo = { ...articulo, barrioRef };

        if (isEditMode) {
            await updateArticulo(updatedArticulo);
        } else {
            await createArticulo(updatedArticulo);
        }

        if (imageFiles) {
            await uploadImageForArticulo(updatedArticulo.id, imageFiles);
        }

        navigate("/articulos");
    };

    const onError = (errors: FieldErrors<any>) => {
        console.log({ errors });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <BoxShadow>
            <header className='mb-4 d-flex justify-content-between align-items-center'>
                <h2>{isEditMode ? 'Editar articulo' : 'Nuevo articulo'}</h2>
            </header>

            <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
                <div className="row">
                    <div className="col-md-6">
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

                        <div className="col-md-12 mb-3">
                            <CustomCurrencyInput
                                size='small'
                                control={control}
                                name="precio"
                                label="Precio"
                                helperText={errors.precio?.message}
                            />
                        </div>

                        <div className="col-md-12 mb-3">
                            <FormControl fullWidth>
                                <InputLabel>Estado publicacion</InputLabel>
                                <Select
                                    size='small'
                                    label="Estado publicacion"
                                    value={watch('estadoPublicacion')}
                                    onChange={(event) => setValue('estadoPublicacion', event.target.value)}
                                >
                                    {estadoPublicacionOptions.map((estado: string) => (
                                        <MenuItem key={estado} value={estado}>{estado}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        <div className="col-md-12 mb-3">
                            <FormControl fullWidth>
                                <InputLabel>Estado articulo</InputLabel>
                                <Select
                                    size='small'
                                    label="Estado articulo"
                                    value={watch('estadoArticulo')}
                                    onChange={(event) => setValue('estadoArticulo', event.target.value)}
                                >
                                    {estadoArticuloOptions.map((estado: string) => (
                                        <MenuItem key={estado} value={estado}>{estado}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        <div className="col-md-12 mb-3">
                            <Autocomplete
                                fullWidth
                                size='small'
                                value={barrio}
                                options={barrios}
                                onChange={handleBarrioChange}
                                getOptionLabel={(barrio: Barrio) => `${barrio.nombre}`}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                renderInput={(params) => <TextField {...params} label="Barrio" />}
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="col-md-12 mb-3">
                            <input
                                multiple
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
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
