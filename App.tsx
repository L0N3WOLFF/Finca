
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import BodegaView from './views/BodegaView';
import AnimalesView from './views/AnimalesView';
import PlaceholderView from './views/PlaceholderView';
import { CowIcon } from './components/icons/CowIcon';
import { MoneyIcon } from './components/icons/MoneyIcon';
import DashboardView from './views/DashboardView';
import EventosView from './views/EventosView';

const App = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView setActiveView={setActiveView} />;
      case 'bodega':
        return <BodegaView />;
      case 'animales':
        return <AnimalesView />;
      case 'contabilidad':
        return <PlaceholderView title="Contabilidad" icon={<MoneyIcon />} />;
      case 'eventos':
        return <EventosView />;
      default:
        return <BodegaView />;
    }
  };

  return (
    <div className="flex h-screen bg-brand-dark font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 overflow-y-auto">
        {renderActiveView()}
      </main>
    </div>
  );
};

export default App;