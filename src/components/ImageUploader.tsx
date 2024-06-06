import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const ImageUploader = ({ onImagesSelected }) => {
    const [imagePreviews, setImagePreviews] = useState([]);

    const onDrop = (acceptedFiles) => {
        const urls = acceptedFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(prevPreviews => [...prevPreviews, ...urls]);
        onImagesSelected(acceptedFiles);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()} style={{ border: '1px dashed #ccc', padding: '20px', textAlign: 'center', margin: '20px 0' }}>
            <input {...getInputProps()} />
            <p>Arrastra y suelta imágenes aquí, o haz clic para seleccionarlas.</p>
            <div>
                {imagePreviews.map((preview, index) => (
                    <img key={index} src={preview} alt={`Imagen ${index}`} style={{ width: '100px', height: '100px', marginRight: '10px' }} />
                ))}
            </div>
        </div>
    );
};

export default ImageUploader;
