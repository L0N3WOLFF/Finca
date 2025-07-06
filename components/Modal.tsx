
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-brand-dark w-full max-w-lg rounded-xl shadow-lg border border-brand-secondary" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-brand-secondary">
          <h2 className="text-2xl font-bold text-brand-light">{title}</h2>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
