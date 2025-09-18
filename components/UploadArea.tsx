
import React, { useState, useCallback, useRef } from 'react';
import { BananaIcon } from './Icons';

interface UploadAreaProps {
  onImageUpload: (file: File) => void;
  isProcessing?: boolean;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onImageUpload, isProcessing = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && !isProcessing) {
      onImageUpload(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [onImageUpload, isProcessing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && !isProcessing) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleClick = () => {
    if (!isProcessing) {
      fileInputRef.current?.click();
    }
  };

  const dragOverClass = isDragging ? 'border-[#FFD700] bg-yellow-50' : 'border-gray-400';
  const processingClass = isProcessing ? 'cursor-wait bg-gray-50' : 'cursor-pointer';

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-full h-52 p-4 border-2 border-dashed ${dragOverClass} ${processingClass} rounded-lg transition-colors duration-200`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      {isProcessing ? (
        <div className="flex flex-col items-center justify-center text-center">
            <div className="banana-loader !w-12 !h-12 !border-4"></div>
            <p className="font-bold text-lg text-gray-700 mt-4">Processando imagem...</p>
        </div>
      ) : (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg, image/png, image/webp"
            className="hidden"
            onChange={handleChange}
            disabled={isProcessing}
          />
          <div className="flex flex-col items-center justify-center text-center">
            <BananaIcon className="w-12 h-12 text-gray-500 mb-2" />
            <p className="font-bold text-lg text-gray-700">
              Arraste a imagem do seu produto aqui
            </p>
            <p className="text-gray-500">ou clique para selecionar</p>
            <p className="text-sm text-gray-400 mt-2">(JPG, PNG, WebP)</p>
          </div>
        </>
      )}
    </div>
  );
};