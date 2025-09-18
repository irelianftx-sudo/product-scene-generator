
import React, { useEffect } from 'react';
import type { HistoryEntry } from '../types';
import { ReuseIcon, CloseIcon } from './Icons';

interface HistoryModalProps {
  item: HistoryEntry;
  onClose: () => void;
  onReuse: (item: HistoryEntry) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ item, onClose, onReuse }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-modal-title"
    >
      <div 
        className="bg-white rounded-lg border-2 border-[#333333] shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b-2 border-[#333333]">
           <h2 id="history-modal-title" className="text-xl font-bold text-[#4A148C]">Detalhes da Geração</h2>
           <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200" aria-label="Fechar modal">
             <CloseIcon className="w-6 h-6" />
           </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-gray-300">
             <img src={item.generatedImage} alt="Imagem gerada do histórico" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-800">Prompt Utilizado:</h3>
              <p className="bg-gray-100 p-3 rounded-md text-sm text-gray-700 max-h-48 overflow-y-auto border border-gray-200">{item.prompt}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Proporção:</h3>
              <p className="font-mono text-gray-700">{item.aspectRatio}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Data:</h3>
              <p className="text-gray-700">{new Date(item.timestamp).toLocaleString('pt-BR')}</p>
            </div>
             <button
                onClick={() => onReuse(item)}
                className="w-full flex items-center justify-center gap-2 text-lg font-bold bg-[#FFD700] text-[#333333] px-6 py-3 rounded-lg border-2 border-[#333333] shadow-md hover:shadow-lg hover:-translate-y-0.5 active:shadow-sm active:translate-y-0 transition-transform duration-150"
              >
                <ReuseIcon />
                Reutilizar Configurações
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};