import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState, ChangeEvent } from 'react';

interface ImageUploaderProps {
    onImagesChange: (files: FileList) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesChange }) => {
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<FileList | null>(null);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);

            const urls = filesArray.map(file => URL.createObjectURL(file));

            setImagePreviews(urls);
            setImageFiles(event.target.files);
            onImagesChange(event.target.files);
        }
    };

    const handleRemoveImage = (index: number) => {
        setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
        if (imageFiles) {
            const updatedFiles = Array.from(imageFiles).filter((_, i) => i !== index);
            const dataTransfer = new DataTransfer();
            updatedFiles.forEach(file => dataTransfer.items.add(file));
            setImageFiles(dataTransfer.files);
            onImagesChange(dataTransfer.files);
        }
    };

    return (
        <section>
            <input
                multiple
                type="file"
                accept="image/*"
                onChange={handleImageChange}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {imagePreviews.map((preview, index) => (
                    <div key={index} style={{ position: 'relative', margin: '10px' }}>
                        <img
                            src={preview}
                            alt={`Imagen ${index}`}
                            style={{ width: index === 0 ? '200px' : '100px', height: index === 0 ? '200px' : '100px', objectFit: 'cover' }}
                        />
                        <IconButton
                            style={{ position: 'absolute', top: 0, right: 0 }}
                            onClick={() => handleRemoveImage(index)}
                        >
                            <DeleteIcon style={{ color: 'red' }} />
                        </IconButton>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ImageUploader;
