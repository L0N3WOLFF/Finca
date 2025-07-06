
import React from 'react';
import { BoxIcon } from './icons/BoxIcon';
import { CowIcon } from './icons/CowIcon';
import { MoneyIcon } from './icons/MoneyIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { DashboardIcon } from './icons/DashboardIcon';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
  <li
    onClick={onClick}
    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
      isActive
        ? 'bg-brand-green text-white shadow-lg'
        : 'text-slate-300 hover:bg-brand-secondary hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-4 font-semibold">{label}</span>
  </li>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <div className="w-64 bg-slate-800 h-screen p-5 flex flex-col shadow-2xl border-r border-brand-secondary">
      <div className="flex items-center mb-10">
        <CowIcon className="h-10 w-10 text-brand-green"/>
        <h1 className="text-xl font-bold ml-3">Mi Finca Digital</h1>
      </div>
      <nav>
        <ul className="space-y-3">
          <NavItem
            icon={<DashboardIcon className="w-6 h-6"/>}
            label="Dashboard"
            isActive={activeView === 'dashboard'}
            onClick={() => setActiveView('dashboard')}
          />
          <NavItem
            icon={<BoxIcon className="w-6 h-6"/>}
            label="Insumos y Bodega"
            isActive={activeView === 'bodega'}
            onClick={() => setActiveView('bodega')}
          />
          <NavItem
            icon={<CowIcon className="w-6 h-6"/>}
            label="Animales"
            isActive={activeView === 'animales'}
            onClick={() => setActiveView('animales')}
          />
          <NavItem
            icon={<MoneyIcon className="w-6 h-6"/>}
            label="Contabilidad"
            isActive={activeView === 'contabilidad'}
            onClick={() => setActiveView('contabilidad')}
          />
           <NavItem
            icon={<ClipboardIcon className="w-6 h-6"/>}
            label="Eventos"
            isActive={activeView === 'eventos'}
            onClick={() => setActiveView('eventos')}
          />
        </ul>
      </nav>
      <div className="mt-auto text-center text-slate-500 text-sm">
        <p>Versión 2.0</p>
        <p>&copy; 2025 Mi Finca Digital</p>
      </div>
    </div>
  );
};
