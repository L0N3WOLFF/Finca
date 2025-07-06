import React from 'react';
import { Evento } from '../types';
import { CalendarIcon } from './icons/CalendarIcon';

export const EventCard: React.FC<{ evento: Evento }> = ({ evento }) => {
    const { titulo, descripcion, fecha } = evento;

    const formattedDate = fecha ? new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }) : null;

    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg flex flex-col border border-brand-secondary transform hover:-translate-y-1 transition-transform duration-300 h-full">
            <h3 className="text-xl font-bold text-brand-light mb-2">{titulo}</h3>
            <p className="text-slate-400 flex-grow mb-4">{descripcion}</p>
            <div className="mt-auto pt-4 border-t border-brand-secondary/50">
                {formattedDate ? (
                    <div className="flex items-center text-brand-green">
                        <CalendarIcon className="w-5 h-5 mr-3" />
                        <span className="font-semibold">{formattedDate}</span>
                    </div>
                ) : (
                     <div className="flex items-center text-amber-500">
                         <CalendarIcon className="w-5 h-5 mr-3" />
                        <span className="font-semibold">Fecha por definir</span>
                    </div>
                )}
            </div>
        </div>
    )
};
