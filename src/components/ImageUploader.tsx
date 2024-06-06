import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploaderProps {
    onImagesSelected: (files: File[]) => void;
}

const ImageUploader = ({ onImagesSelected }: ImageUploaderProps) => {
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const onDrop = (acceptedFiles: File[]) => {
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
