
import React from 'react';
import { DownloadIcon, ImageIcon } from './Icons';

interface ImageCardProps {
  title: string;
  imageUrl?: string | null;
  isLoading?: boolean;
  onDownload?: () => void;
  aspectRatio?: string;
}

export const ImageCard: React.FC<ImageCardProps> = ({ title, imageUrl, isLoading = false, onDownload, aspectRatio }) => {
  const getAspectRatioClass = (ratio?: string) => {
    if (title !== 'Resultado' || !ratio || !ratio.includes(':')) {
        return 'aspect-square';
    }
    const [w, h] = ratio.split(':');
    if (isNaN(Number(w)) || isNaN(Number(h)) || Number(h) === 0) {
        return 'aspect-square';
    }
    return `aspect-[${w}/${h}]`;
  };

  const containerAspectRatioClass = getAspectRatioClass(aspectRatio);

  return (
    <div className="bg-white p-4 rounded-lg border-2 border-[#333333] shadow-lg space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        {onDownload && imageUrl && !isLoading && (
          <button
            onClick={onDownload}
            className="flex items-center gap-2 font-bold bg-white text-[#4A148C] px-3 py-1 rounded-lg border-2 border-[#4A148C] shadow-md hover:shadow-lg hover:-translate-y-px active:shadow-sm active:translate-y-0 transition-all"
          >
            <DownloadIcon />
            Baixar
          </button>
        )}
      </div>
      <div className={`relative w-full ${containerAspectRatioClass} bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-gray-300`}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="banana-loader"></div>
            <p className="font-semibold text-gray-600">Criando um cenário mágico...</p>
            <p className="text-sm text-gray-500 max-w-xs">A IA pode levar alguns instantes para processar. Vale a pena esperar!</p>
          </div>
        ) : imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-contain" />
        ) : (
          <div className="text-gray-400 flex flex-col items-center gap-2">
            <ImageIcon className="w-16 h-16" />
            <span className="font-medium">Aguardando imagem</span>
          </div>
        )}
      </div>
    </div>
  );
};