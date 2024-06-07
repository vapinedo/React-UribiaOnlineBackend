import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploaderProps {
    onImagesSelected: (files: File[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesSelected }) => {
    const [mainImage, setMainImage] = useState<File | null>(null);
    const [thumbnailImages, setThumbnailImages] = useState<File[]>([]);

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setMainImage(acceptedFiles[0]);
            setThumbnailImages(acceptedFiles.slice(1));
            onImagesSelected(acceptedFiles);
        }
    };

    const removeImage = (index: number) => {
        if (index === 0) {
            setMainImage(null);
        } else {
            const updatedThumbnails = [...thumbnailImages];
            updatedThumbnails.splice(index - 1, 1);
            setThumbnailImages(updatedThumbnails);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div>
            <div {...getRootProps()} style={{ border: '1px dashed #ccc', padding: '20px', textAlign: 'center', margin: '20px 0' }}>
                <input {...getInputProps()} />
                <p>Arrastra y suelta imágenes aquí, o haz clic para seleccionarlas.</p>
            </div>
            {mainImage && (
                <div style={{ marginBottom: '20px' }}>
                    <h4>Imagen Principal</h4>
                    <img src={URL.createObjectURL(mainImage)} alt="Imagen principal" style={{ width: '300px', height: '300px', objectFit: 'cover' }} />
                    <button type="button" onClick={() => removeImage(0)}>Eliminar</button>
                </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {thumbnailImages.map((file, index) => (
                    <div key={index} style={{ marginRight: '10px', marginBottom: '10px' }}>
                        <img src={URL.createObjectURL(file)} alt={`Miniatura ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                        <button type="button" onClick={() => removeImage(index + 1)}>Eliminar</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageUploader;
