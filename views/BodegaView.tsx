import React, { useState, useEffect, useCallback } from 'react';
import { Insumo, MovimientoInsumo, Animal, UnidadMedida, InsumoFormValues } from '../types';
import { api } from '../services/api';
import { Modal } from '../components/Modal';
import { HistoryIcon } from '../components/icons/HistoryIcon';
import { PlusIcon } from '../components/icons/PlusIcon';

//--- Sub-Components (Forms within Modals) ---

interface AddInsumoFormProps {
    onSave: (data: InsumoFormValues) => Promise<void>;
    onClose: () => void;
    isLoading: boolean;
}

const AddInsumoForm: React.FC<AddInsumoFormProps> = ({ onSave, onClose, isLoading }) => {
    const [formData, setFormData] = useState<InsumoFormValues>({
        nombre_producto: '',
        tipo_indicacion: '',
        unidad_medida: UnidadMedida.mL,
        precio: 0,
        fecha_caducidad: new Date(),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'date') {
             setFormData(prev => ({ ...prev, [name]: new Date(value) }));
        } else {
             setFormData(prev => ({ ...prev, [name]: name === 'precio' ? parseFloat(value) || 0 : value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="nombre_producto" placeholder="Nombre del Producto" required onChange={handleChange} className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-green" />
            <textarea name="tipo_indicacion" placeholder="Tipo de Producto / Indicación Principal" required onChange={handleChange} className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-green" />
            <div className="grid grid-cols-2 gap-4">
                <select name="unidad_medida" onChange={handleChange} value={formData.unidad_medida} className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-green">
                    {Object.values(UnidadMedida).map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <input type="number" name="precio" placeholder="Precio" required onChange={handleChange} min="0" step="0.01" className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-green" />
            </div>
             <div>
                <label htmlFor="fecha_caducidad" className="block text-sm font-medium text-slate-300 mb-1">Fecha de Caducidad</label>
                <input type="date" name="fecha_caducidad" id="fecha_caducidad" required onChange={handleChange} className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-green" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-brand-secondary text-white font-semibold">Cancelar</button>
                <button type="submit" disabled={isLoading} className="px-6 py-2 rounded-lg bg-brand-green text-white font-semibold disabled:bg-slate-500">{isLoading ? 'Guardando...' : 'Guardar Insumo'}</button>
            </div>
        </form>
    );
};


interface CompraFormProps {
    insumos: Insumo[];
    onSave: (insumoId: number, cantidad: number, motivo: string) => Promise<void>;
    onClose: () => void;
    isLoading: boolean;
}

const CompraForm: React.FC<CompraFormProps> = ({ insumos, onSave, onClose, isLoading }) => {
    const [insumoId, setInsumoId] = useState<number | undefined>(insumos[0]?.id);
    const [cantidad, setCantidad] = useState(0);
    const [motivo, setMotivo] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (insumoId && cantidad > 0) {
            await onSave(insumoId, cantidad, motivo);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <select onChange={(e) => setInsumoId(Number(e.target.value))} value={insumoId} className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-green">
                {insumos.map(i => <option key={i.id} value={i.id}>{i.nombre_producto}</option>)}
            </select>
            <input type="number" placeholder="Cantidad Comprada" required onChange={(e) => setCantidad(parseFloat(e.target.value))} min="0.01" step="0.01" className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-green" />
            <input type="text" placeholder="Descripción (Ej: Factura #123)" required onChange={(e) => setMotivo(e.target.value)} className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-green" />
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-brand-secondary text-white font-semibold">Cancelar</button>
                <button type="submit" disabled={isLoading || !insumoId || cantidad <= 0} className="px-6 py-2 rounded-lg bg-brand-green text-white font-semibold disabled:bg-slate-500">{isLoading ? 'Registrando...' : 'Registrar Compra'}</button>
            </div>
        </form>
    );
};

interface UsoFormProps {
    insumos: Insumo[];
    animales: Animal[];
    onSave: (insumoId: number, cantidad: number, animalId: number, motivo: string) => Promise<void>;
    onClose: () => void;
    isLoading: boolean;
}

const UsoForm: React.FC<UsoFormProps> = ({ insumos, animales, onSave, onClose, isLoading }) => {
    const [insumoId, setInsumoId] = useState<number | undefined>(insumos.find(i => i.cantidad > 0)?.id);
    const [cantidad, setCantidad] = useState(0);
    const [animalId, setAnimalId] = useState<number | undefined>(animales[0]?.id);
    const [motivo, setMotivo] = useState('');

    const selectedInsumo = insumos.find(i => i.id === insumoId);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (insumoId && animalId && cantidad > 0) {
            await onSave(insumoId, cantidad, animalId, motivo);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                 <select onChange={(e) => setInsumoId(Number(e.target.value))} value={insumoId} className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-green">
                    {insumos.filter(i => i.cantidad > 0).map(i => <option key={i.id} value={i.id}>{i.nombre_producto}</option>)}
                </select>
                {selectedInsumo && <p className="text-sm text-slate-400 mt-1">Stock actual: {selectedInsumo.cantidad.toFixed(2)} {selectedInsumo.unidad_medida}</p>}
            </div>
             <input type="number" placeholder="Cantidad Usada" required onChange={(e) => setCantidad(parseFloat(e.target.value))} min="0.01" step="0.01" max={selectedInsumo?.cantidad} className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-green" />
             <select onChange={(e) => setAnimalId(Number(e.target.value))} value={animalId} className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-green">
                {animales.map(a => <option key={a.id} value={a.id}>{a.numero_arete} - {a.nombre}</option>)}
            </select>
            <input type="text" placeholder="Motivo (Ej: Tratamiento por fiebre)" required onChange={(e) => setMotivo(e.target.value)} className="w-full p-3 bg-slate-700 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-green" />
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-brand-secondary text-white font-semibold">Cancelar</button>
                <button type="submit" disabled={isLoading || !insumoId || !animalId || cantidad <= 0 || cantidad > (selectedInsumo?.cantidad ?? 0)} className="px-6 py-2 rounded-lg bg-brand-green text-white font-semibold disabled:bg-slate-500">{isLoading ? 'Registrando...' : 'Registrar Uso'}</button>
            </div>
        </form>
    );
};


interface HistoryModalContentProps {
    insumo: Insumo;
}

const HistoryModalContent: React.FC<HistoryModalContentProps> = ({ insumo }) => {
    const [movimientos, setMovimientos] = useState<MovimientoInsumo[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMovimientos = async () => {
            setIsLoading(true);
            const data = await api.getMovimientosByInsumoId(insumo.id);
            setMovimientos(data);
            setIsLoading(false);
        };
        fetchMovimientos();
    }, [insumo.id]);

    if (isLoading) return <p className="text-center">Cargando historial...</p>;

    if (movimientos.length === 0) return <p className="text-center text-slate-400">No hay movimientos para este insumo.</p>

    return (
        <div className="max-h-96 overflow-y-auto">
            <ul className="space-y-3">
                {movimientos.map(mov => (
                    <li key={mov.id} className={`p-3 rounded-lg flex justify-between items-center ${mov.cantidad > 0 ? 'bg-emerald-900/50' : 'bg-red-900/50'}`}>
                        <div>
                            <p className="font-bold">{mov.tipo_movimiento}</p>
                            <p className="text-sm text-slate-300">{mov.descripcion}</p>
                            <p className="text-xs text-slate-400">{mov.fecha_movimiento.toLocaleString()}</p>
                        </div>
                        <p className={`font-bold text-lg ${mov.cantidad > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {mov.cantidad > 0 ? `+${mov.cantidad}` : mov.cantidad}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};


//--- Main View Component ---

const getStatus = (expDate: Date): { text: string; className: string } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to the start of the day
    const warningDate = new Date(today);
    warningDate.setDate(today.getDate() + 30); // 30 days warning period
    
    if (expDate < today) {
        return { text: 'Vencido', className: 'bg-red-500 text-white' };
    }
    if (expDate < warningDate) {
        return { text: 'Próximo a Vencer', className: 'bg-yellow-500 text-black font-bold' };
    }
    return { text: 'Bueno', className: 'bg-emerald-500 text-white' };
};

const BodegaView = () => {
    const [insumos, setInsumos] = useState<Insumo[]>([]);
    const [animales, setAnimales] = useState<Animal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalState, setModalState] = useState<{ type: 'add' | 'buy' | 'use' | 'history' | null; data?: Insumo }>({ type: null });
    const [actionLoading, setActionLoading] = useState(false);
    const [showIndicacion, setShowIndicacion] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const [insumosData, animalesData] = await Promise.all([api.getInsumos(), api.getAnimales()]);
        setInsumos(insumosData);
        setAnimales(animalesData);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const closeModal = () => setModalState({ type: null });

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
    
    const handleSaveInsumo = (data: InsumoFormValues) => handleAction(api.addInsumo(data));
    const handleSaveCompra = (insumoId: number, cantidad: number, motivo: string) => handleAction(api.addCompraInsumo(insumoId, cantidad, motivo));
    const handleSaveUso = (insumoId: number, cantidad: number, animalId: number, motivo: string) => handleAction(api.addUsoInsumo(insumoId, cantidad, animalId, motivo));

    if (isLoading && insumos.length === 0) {
        return <div className="text-center p-10">Cargando bodega...</div>;
    }
    
    return (
        <div className="p-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-white">Estado de Bodega</h1>
                <div className="flex gap-4 flex-wrap">
                    <button onClick={() => setModalState({ type: 'buy' })} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                        <PlusIcon className="w-5 h-5"/> Registrar Compra
                    </button>
                    <button onClick={() => setModalState({ type: 'use' })} className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                        <PlusIcon className="w-5 h-5"/> Registrar Uso
                    </button>
                    <button onClick={() => setModalState({ type: 'add' })} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                        <PlusIcon className="w-5 h-5"/> Añadir Insumo
                    </button>
                     <button onClick={() => setShowIndicacion(!showIndicacion)} className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                        {showIndicacion ? 'Ocultar' : 'Mostrar'} Indicaciones
                    </button>
                </div>
            </header>

            <div className="bg-slate-800 rounded-xl shadow-lg overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-brand-secondary">
                        <tr>
                            <th className="p-4 font-semibold">Nombre del Producto</th>
                            <th className="p-4 font-semibold text-right">Cantidad</th>
                            <th className="p-4 font-semibold">Unidad</th>
                            <th className="p-4 font-semibold text-right">Precio</th>
                            <th className="p-4 font-semibold">Vencimiento</th>
                            <th className="p-4 font-semibold text-center">Estado</th>
                            <th className="p-4 font-semibold text-center">Acciones</th>
                            {showIndicacion && <th className="p-4 font-semibold">Tipo / Indicación</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {insumos.map((insumo) => {
                            const status = getStatus(insumo.fecha_caducidad);
                            return (
                                <tr key={insumo.id} className="border-b border-brand-secondary hover:bg-slate-700/50">
                                    <td className="p-4 font-bold">{insumo.nombre_producto}</td>
                                    <td className="p-4 font-mono text-lg text-right">{insumo.cantidad.toFixed(2)}</td>
                                    <td className="p-4 text-slate-400">{insumo.unidad_medida}</td>
                                    <td className="p-4 font-mono text-right">{insumo.precio ? `$${insumo.precio.toFixed(2)}` : 'N/A'}</td>
                                    <td className="p-4 font-mono">{insumo.fecha_caducidad.toLocaleDateString()}</td>
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 text-xs rounded-full ${status.className}`}>
                                            {status.text}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button onClick={() => setModalState({ type: 'history', data: insumo })} className="p-2 rounded-full hover:bg-brand-secondary transition-colors" title="Ver Historial">
                                            <HistoryIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                    {showIndicacion && <td className="p-4 text-slate-400 max-w-xs truncate">{insumo.tipo_indicacion}</td>}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            <Modal isOpen={modalState.type === 'add'} onClose={closeModal} title="Añadir Nuevo Insumo al Catálogo">
                <AddInsumoForm onClose={closeModal} onSave={handleSaveInsumo} isLoading={actionLoading} />
            </Modal>
            <Modal isOpen={modalState.type === 'buy'} onClose={closeModal} title="Registrar Compra de Insumos">
                <CompraForm insumos={insumos} onClose={closeModal} onSave={handleSaveCompra} isLoading={actionLoading} />
            </Modal>
             <Modal isOpen={modalState.type === 'use'} onClose={closeModal} title="Registrar Uso de Insumos">
                <UsoForm insumos={insumos} animales={animales} onClose={closeModal} onSave={handleSaveUso} isLoading={actionLoading} />
            </Modal>
            <Modal isOpen={modalState.type === 'history'} onClose={closeModal} title={`Historial de ${modalState.data?.nombre_producto}`}>
                {modalState.data && <HistoryModalContent insumo={modalState.data} />}
            </Modal>
        </div>
    );
};

export default BodegaView;