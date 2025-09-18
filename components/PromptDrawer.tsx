
import React, { useEffect } from 'react';
import { CloseIcon } from './Icons';

interface Prompt {
  title: string;
  prompt: string;
}

interface PromptDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  prompts: Prompt[];
  onSelectPrompt: (prompt: string) => void;
}

export const PromptDrawer: React.FC<PromptDrawerProps> = ({ isOpen, onClose, prompts, onSelectPrompt }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSelect = (prompt: string) => {
    onSelectPrompt(prompt);
    onClose();
  };

  const drawerPrompts = prompts.filter(p => p.prompt); // Exclui a opção de placeholder

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`fixed bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out 
                   bottom-0 left-0 right-0 h-[80vh] rounded-t-lg
                   md:top-0 md:right-0 md:bottom-auto md:left-auto md:h-full md:w-full md:max-w-md md:rounded-none md:rounded-l-lg
                   ${
                     isOpen 
                       ? 'translate-y-0 md:translate-x-0' 
                       : 'translate-y-full md:translate-y-0 md:translate-x-full'
                   }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between p-4 border-b-2 border-[#333333]">
            <h2 id="drawer-title" className="text-xl font-bold text-[#4A148C]">
              Biblioteca de Estilos
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Fechar"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </header>

          <div className="flex-grow overflow-y-auto p-4">
            <p className="text-sm text-gray-600 mb-4">
              Selecione um estilo pré-definido para começar. Você pode ajustar o prompt depois.
            </p>
            <ul className="space-y-3">
              {drawerPrompts.map((p) => (
                <li key={p.title}>
                  <button
                    onClick={() => handleSelect(p.prompt)}
                    className="w-full text-left p-4 bg-white rounded-lg border-2 border-[#333333] hover:border-[#FFD700] hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2 transition-all duration-150 shadow-md hover:shadow-lg active:shadow-sm"
                  >
                    <span className="font-bold text-gray-800">{p.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
