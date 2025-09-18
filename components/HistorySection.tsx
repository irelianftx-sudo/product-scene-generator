
import React from 'react';
import type { HistoryEntry } from '../types';
import { HistoryIcon, ReuseIcon, TrashIcon, ViewIcon, ClearIcon } from './Icons';
import LazyHistoryImage from './LazyHistoryImage';

interface HistorySectionProps {
  history: HistoryEntry[];
  onPreview: (item: HistoryEntry) => void;
  onReuse: (item: HistoryEntry) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({ history, onPreview, onReuse, onDelete, onClear }) => {
  return (
    <div className="mt-12 bg-white p-6 rounded-lg border-2 border-[#333333] shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-[#4A148C] flex items-center gap-3">
          <HistoryIcon className="w-8 h-8"/>
          Histórico de Gerações
        </h2>
        {history.length > 0 && (
          <button 
            onClick={onClear} 
            className="flex items-center justify-center gap-2 text-md font-bold bg-red-500 text-white px-4 py-2 rounded-lg border-2 border-red-700 shadow-md hover:shadow-lg hover:-translate-y-px active:shadow-sm active:translate-y-0 transition-all duration-150"
            aria-label="Limpar todo o histórico"
          >
            <ClearIcon className="w-5 h-5" />
            Limpar Histórico
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>Você ainda não gerou nenhuma imagem.</p>
          <p className="text-sm">Seu histórico aparecerá aqui quando você criar cenários.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {history.map(item => (
            <div key={item.id} className="group relative aspect-square rounded-lg overflow-hidden border-2 border-[#333333] shadow-md cursor-pointer" onClick={() => onPreview(item)}>
              <LazyHistoryImage 
                src={item.generatedImage} 
                alt="Imagem gerada do histórico" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex flex-col justify-end text-white p-2">
                 <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-xs font-semibold mb-2">{new Date(item.timestamp).toLocaleDateString('pt-BR')}</p>
                    <div className="flex justify-around items-center bg-gray-800 bg-opacity-50 rounded-md p-1">
                      <button onClick={(e) => { e.stopPropagation(); onPreview(item); }} className="p-1 hover:text-[#FFD700]" aria-label="Visualizar item do histórico"><ViewIcon className="w-5 h-5" /></button>
                      <button onClick={(e) => { e.stopPropagation(); onReuse(item); }} className="p-1 hover:text-[#FFD700]" aria-label="Reutilizar item do histórico"><ReuseIcon className="w-5 h-5" /></button>
                      <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} className="p-1 hover:text-red-500" aria-label="Excluir item do histórico"><TrashIcon className="w-5 h-5" /></button>
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};