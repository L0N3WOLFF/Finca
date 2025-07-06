
import React, { useState, useEffect, useCallback } from 'react';
import { Animal, AnimalFormValues, Sexo } from '../types';
import { api } from '../services/api';
import { Modal } from '../components/Modal';
import { PlusIcon } from '../components/icons/PlusIcon';
import { CowIcon } from '../components/icons/CowIcon';

// --- Sub-Components (Forms within Modals) ---

interface AddAnimalFormProps {
    onSave: (data: AnimalFormValues) => Promise<void>;
    onClose: () => void;
    isLoading: boolean;
}

const AddAnimalForm: React.FC<AddAnimalFormProps> = ({ onSave, onClose, isLoading }) => {
    const [formData, setFormData] = useState<AnimalFormValues>({
        numero_arete: '',
        nombre: '',
        sexo: Sexo.Hembra,
        edad: 0,
        padre: '',
        madre: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'edad' ? parseInt(value, 10) || 0 : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <input type="text" name="nombre" placeholder="Nombre del Animal" required onChange={handleChange} className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-green" />
                <input type="text" name="numero_arete" placeholder="Número de Arete" required onChange={handleChange} className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-green" />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <select name="sexo" onChange={handleChange} value={formData.sexo} className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-green">
                    {Object.values(Sexo).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input type="number" name="edad" placeholder="Edad (años)" required onChange={handleChange} min="0" className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-green" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <input type="text" name="madre" placeholder="Madre (opcional)" onChange={handleChange} className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-green" />
                 <input type="text" name="padre" placeholder="Padre (opcional)" onChange={handleChange} className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-green" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-brand-secondary text-white font-semibold">Cancelar</button>
                <button type="submit" disabled={isLoading} className="px-6 py-2 rounded-lg bg-brand-green text-white font-semibold disabled:bg-slate-500">{isLoading ? 'Guardando...' : 'Guardar Animal'}</button>
            </div>
        </form>
    );
};


//--- Main View Component ---

const AnimalesView = () => {
    const [animales, setAnimales] = useState<Animal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const animalesData = await api.getAnimales();
        setAnimales(animalesData);
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
    
    const handleSaveAnimal = (data: AnimalFormValues) => handleAction(api.addAnimal(data));

    if (isLoading && animales.length === 0) {
        return <div className="text-center p-10">Cargando inventario de animales...</div>;
    }
    
    return (
        <div className="p-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-white">Inventario de Animales</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-brand-green hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                    <PlusIcon className="w-5 h-5"/> Añadir Animal
                </button>
            </header>

            <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-brand-secondary">
                        <tr>
                            <th className="p-4 font-semibold">Arete</th>
                            <th className="p-4 font-semibold">Nombre</th>
                            <th className="p-4 font-semibold">Sexo</th>
                            <th className="p-4 font-semibold">Edad (años)</th>
                            <th className="p-4 font-semibold">Madre</th>
                            <th className="p-4 font-semibold">Padre</th>
                        </tr>
                    </thead>
                    <tbody>
                        {animales.map((animal) => (
                            <tr key={animal.id} className="border-b border-brand-secondary hover:bg-slate-700/50">
                                <td className="p-4 font-mono">{animal.numero_arete}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <CowIcon className="w-6 h-6 text-brand-light" />
                                        <p className="font-bold">{animal.nombre}</p>
                                    </div>
                                </td>
                                <td className="p-4">{animal.sexo}</td>
                                <td className="p-4 font-mono">{animal.edad}</td>
                                <td className="p-4">{animal.madre || 'N/A'}</td>
                                <td className="p-4">{animal.padre || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            <Modal isOpen={isModalOpen} onClose={closeModal} title="Añadir Nuevo Animal">
                <AddAnimalForm onClose={closeModal} onSave={handleSaveAnimal} isLoading={actionLoading} />
            </Modal>
        </div>
    );
};

export default AnimalesView;
