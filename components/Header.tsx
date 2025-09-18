
import React from 'react';
import { BananaIcon } from './Icons';

export const Header: React.FC = () => (
  <header className="text-center p-4 bg-white rounded-lg border-2 border-[#333333] shadow-lg">
    <div className="flex items-center justify-center gap-4">
      <div className="text-[#FFD700] bg-[#4A148C] p-2 rounded-full">
         <BananaIcon className="w-10 h-10" />
      </div>
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#4A148C]">
          Gerador de Cenários para Produtos
        </h1>
        <p className="text-lg font-bold text-[#333333] bg-[#FFD700] inline-block px-2 transform -skew-x-12">
          NanoBanana
        </p>
      </div>
    </div>
  </header>
);