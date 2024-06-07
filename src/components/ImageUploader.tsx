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
        setImagePreviews(urls);
        setImageFiles(acceptedFiles);
        onImagesSelected(acceptedFiles);
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

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        disabled: imageFiles.length > 0 // Deshabilitar la funcionalidad de dropzone si hay imágenes cargadas
    });

    return (
        <section>
            {imagePreviews.length === 0 && (
                <article {...getRootProps()} style={{ cursor: 'pointer', border: '1px dashed #ccc', padding: '55px', textAlign: 'center', margin: '0 0' }}>
                    <input {...getInputProps()} />
                    <p>Arrastra y suelta imágenes aquí, o haz clic para seleccionarlas.</p>
                </article>
            )}
            {imagePreviews.map((preview, index) => (
                <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={preview} alt={`Imagen ${index}`} style={{ width: '100px', height: '100px', marginRight: '10px' }} />
                    <i className='bx bx-x-circle' onClick={() => removeImage(index)} style={{ color: 'gray', fontSize: '28px', cursor: 'pointer', position: 'absolute', top: 0, right: 0 }}></i>
                </div>
            ))}
        </section>
    );
};

export default ImageUploader;
