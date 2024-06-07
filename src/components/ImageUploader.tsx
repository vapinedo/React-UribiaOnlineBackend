import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploaderProps {
    onImagesSelected: (files: File[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesSelected }) => {
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    const onDrop = (acceptedFiles: File[]) => {
        const urls = acceptedFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(prevPreviews => [...prevPreviews, ...urls]);
        setImageFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
        onImagesSelected(imageFiles);
    };

    const removeImage = (index: number) => {
        const updatedPreviews = [...imagePreviews];
        updatedPreviews.splice(index, 1);
        setImagePreviews(updatedPreviews);

        const updatedFiles = [...imageFiles];
        updatedFiles.splice(index, 1);
        setImageFiles(updatedFiles);

        onImagesSelected(updatedFiles);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div>
            <div {...getRootProps()} style={{ border: '1px dashed #ccc', padding: '20px', textAlign: 'center', margin: '20px 0' }}>
                <input {...getInputProps()} />
                <p>Arrastra y suelta imágenes aquí, o haz clic para seleccionarlas.</p>
            </div>
            {imagePreviews.map((preview, index) => (
                <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={preview} alt={`Imagen ${index}`} style={{ width: '100px', height: '100px', marginRight: '10px' }} />
                    <button type="button" onClick={() => removeImage(index)} style={{ position: 'absolute', top: 0, right: 0 }}>Eliminar</button>
                </div>
            ))}
        </div>
    );
};

export default ImageUploader;
