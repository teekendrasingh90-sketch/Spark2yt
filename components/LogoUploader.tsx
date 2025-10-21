
import React, { useState, useCallback, useRef, ChangeEvent, DragEvent } from 'react';
import UploadIcon from './icons/UploadIcon';

interface LogoUploaderProps {
    onLogoChange: (file: File | null) => void;
    logoPreview: string | null;
    disabled?: boolean;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ onLogoChange, logoPreview, disabled = false }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) setIsDragging(true);
    }, [disabled]);

    const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (disabled) return;

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onLogoChange(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    }, [disabled, onLogoChange]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onLogoChange(e.target.files[0]);
        }
    };
    
    const handleClick = () => {
        if (!disabled) {
            fileInputRef.current?.click();
        }
    };

    const handleRemoveLogo = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onLogoChange(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    const uploaderClasses = `relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-slate-800 border-slate-600 hover:bg-slate-700 transition-colors ${
        isDragging ? 'border-sky-400' : ''
    } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`;

    return (
        <div>
            <label htmlFor="logo-upload" className="block mb-2 text-sm font-medium text-slate-300">
                App Logo (Optional)
            </label>
            <div
                className={uploaderClasses}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                {logoPreview ? (
                    <>
                        <img src={logoPreview} alt="Logo preview" className="object-contain h-24 w-24 rounded-lg" />
                        {!disabled && (
                            <button
                                onClick={handleRemoveLogo}
                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs"
                                aria-label="Remove logo"
                            >
                                &#x2715;
                            </button>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400">
                        <UploadIcon className="w-10 h-10 mb-3" />
                        <p className="mb-2 text-sm"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs">PNG, JPG, or SVG (1:1 ratio recommended)</p>
                    </div>
                )}
                <input
                    ref={fileInputRef}
                    id="logo-upload"
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/svg+xml"
                    onChange={handleChange}
                    disabled={disabled}
                />
            </div>
        </div>
    );
};

export default LogoUploader;
