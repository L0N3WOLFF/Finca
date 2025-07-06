import React from 'react';

const PlaceholderView: React.FC<{ title: string; icon: React.ReactElement<{ className?: string }> }> = ({ title, icon }) => {
  return (
    <div className="p-8 h-full flex flex-col items-center justify-center text-center">
      <div className="text-brand-secondary mb-4">
        {React.cloneElement(icon, { className: 'w-24 h-24' })}
      </div>
      <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
      <p className="text-slate-400 text-lg">Este módulo está en construcción.</p>
    </div>
  );
};

export default PlaceholderView;
