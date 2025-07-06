import React, { useState, useEffect, useCallback } from 'react';
import { Evento, EventoFormValues } from '../types';
import { api } from '../services/api';
import { Modal } from '../components/Modal';
import { PlusIcon } from '../components/icons/PlusIcon';
import { EventCard } from '../components/EventCard';

// --- Sub-Components (Forms within Modals) ---

interface AddEventoFormProps {
    onSave: (data: EventoFormValues) => Promise<void>;
    onClose: () => void;
    isLoading: boolean;
}

const AddEventoForm: React.FC<AddEventoFormProps> = ({ onSave, onClose, isLoading }) => {
    const [formData, setFormData] = useState<EventoFormValues>({
        titulo: '',
        descripcion: '',
        fecha: undefined,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'date') {
            // Set to undefined if date is cleared, otherwise create Date object
            setFormData(prev => ({ ...prev, [name]: value ? new Date(value) : undefined }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    // Helper to format date for input field
    const getInputValue = (date?: Date) => {
        if (!date) return '';
        const d = new Date(date);
        // Adjust for timezone offset to get correct YYYY-MM-DD
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().split('T')[0];
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="titulo" placeholder="Título del Evento" required onChange={handleChange} className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-green" />
            <textarea name="descripcion" placeholder="Descripción del evento" required onChange={handleChange} className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-green" rows={4}/>
             <div>
                <label htmlFor="fecha" className="block text-sm font-medium text-slate-300 mb-1">Fecha del Evento (Opcional)</label>
                <input type="date" name="fecha" id="fecha" onChange={handleChange} value={getInputValue(formData.fecha)} className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-green" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-brand-secondary text-white font-semibold">Cancelar</button>
                <button type="submit" disabled={isLoading} className="px-6 py-2 rounded-lg bg-brand-green text-white font-semibold disabled:bg-slate-500">{isLoading ? 'Guardando...' : 'Guardar Evento'}</button>
            </div>
        </form>
    );
};


//--- Main View Component ---

const EventosView = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const eventosData = await api.getEventos();
        setEventos(eventosData);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const closeModal = () => setIsModalOpen(false);

    const handleAction = async (action: Promise<any>) => {
        setActionLoading(true);
        try {
            await action;
            await fetchData();
            closeModal();
        } catch (error) {
            console.error("API Action failed:", error);
            alert((error as Error).message);
        } finally {
            setActionLoading(false);
        }
    };
    
    const handleSaveEvento = (data: EventoFormValues) => handleAction(api.addEvento(data));

    if (isLoading && eventos.length === 0) {
        return <div className="text-center p-10">Cargando eventos...</div>;
    }
    
    return (
        <div className="p-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-white">Gestión de Eventos</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-brand-green hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                    <PlusIcon className="w-5 h-5"/> Añadir Evento
                </button>
            </header>

            {eventos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {eventos.map(evento => (
                        <EventCard key={evento.id} evento={evento} />
                    ))}
                </div>
            ) : (
                <div className="bg-slate-800 p-8 rounded-xl text-center mt-8">
                    <h2 className="text-2xl font-bold mb-2">No hay eventos programados</h2>
                    <p className="text-slate-400">Haga clic en "Añadir Evento" para crear su primera tarea.</p>
                </div>
            )}


            {/* Modals */}
            <Modal isOpen={isModalOpen} onClose={closeModal} title="Añadir Nuevo Evento">
                <AddEventoForm onClose={closeModal} onSave={handleSaveEvento} isLoading={actionLoading} />
            </Modal>
        </div>
    );
};

export default EventosView;
