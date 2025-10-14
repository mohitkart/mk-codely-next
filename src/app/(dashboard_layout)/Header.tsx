// src/components/Header.tsx
import React from 'react';

interface HeaderProps {
  onMenuToggle: () => void;
  currentPage: string;
  user:any
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, currentPage,user }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center">
          <button 
            onClick={onMenuToggle}
            className="mr-4 text-gray-500 hover:text-gray-700 lg:hidden"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{currentPage}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <span className="material-symbols-outlined absolute left-3 top-2 text-gray-400">search</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;