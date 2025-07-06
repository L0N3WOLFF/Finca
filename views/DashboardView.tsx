
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { Animal, Insumo, Evento, Sexo } from '../types';
import { CowIcon } from '../components/icons/CowIcon';
import { BoxIcon } from '../components/icons/BoxIcon';
import { PlusIcon } from '../components/icons/PlusIcon';
import { EventCard } from '../components/EventCard';
import { SimpleBarChart } from '../components/charts/SimpleBarChart';
import { BarChartIcon } from '../components/icons/BarChartIcon';
import { AlertTriangleIcon } from '../components/icons/AlertTriangleIcon';
import { MoneyIcon } from '../components/icons/MoneyIcon';

interface DashboardViewProps {
  setActiveView: (view: string) => void;
}

const StatCard: React.FC<{ title: string, icon: React.ReactElement<{ className?: string }>, children: React.ReactNode, actions?: React.ReactNode }> = ({ title, icon, children, actions }) => (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg flex flex-col border border-brand-secondary h-full">
        <div className="flex items-center mb-4">
            {React.cloneElement(icon, { className: 'w-7 h-7 text-brand-green' })}
            <h2 className="text-xl font-bold ml-3">{title}</h2>
        </div>
        <div className="flex-grow space-y-3">{children}</div>
        {actions && <div className="mt-4 pt-4 border-t border-brand-secondary/50">{actions}</div>}
    </div>
);

const DashboardView: React.FC<DashboardViewProps> = ({ setActiveView }) => {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [insumos, setInsumos] = useState<Insumo[]>([]);
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [animalsData, insumosData, eventosData] = await Promise.all([
                    api.getAnimales(),
                    api.getInsumos(),
                    api.getEventos()
                ]);
                setAnimals(animalsData);
                setInsumos(insumosData);
                setEventos(eventosData);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const animalSummary = useMemo(() => {
        const total = animals.length;
        const hembras = animals.filter(a => a.sexo === Sexo.Hembra).length;
        const machos = animals.filter(a => a.sexo === Sexo.Macho).length;
        const sinParentesco = animals.filter(a => !a.madre && !a.padre).length;
        return { total, hembras, machos, sinParentesco };
    }, [animals]);

    const insumoSummary = useMemo(() => {
        const valorTotal = insumos.reduce((acc, item) => acc + (item.precio || 0) * item.cantidad, 0);
        const today = new Date();
        const warningDate = new Date();
        warningDate.setDate(today.getDate() + 30);
        const proximosAVencer = insumos.filter(item => {
            const expDate = new Date(item.fecha_caducidad);
            return expDate > today && expDate <= warningDate;
        }).length;
        const sinPrecio = insumos.filter(item => item.precio === undefined || item.precio === 0).length;
        return { valorTotal, proximosAVencer, sinPrecio };
    }, [insumos]);

    const proximosEventos = useMemo(() => eventos.slice(0, 2), [eventos]);

    const animalAgeData = useMemo(() => {
        const ageGroups = { 'Terneros (<2)': 0, 'Jóvenes (2-4)': 0, 'Adultos (>4)': 0 };
        animals.forEach(animal => {
            if (animal.edad < 2) ageGroups['Terneros (<2)']++;
            else if (animal.edad <= 4) ageGroups['Jóvenes (2-4)']++;
            else ageGroups['Adultos (>4)']++;
        });
        return Object.entries(ageGroups).map(([name, value]) => ({ name, value }));
    }, [animals]);

    if (isLoading) {
        return <div className="p-8 text-center">Cargando dashboard...</div>;
    }

    return (
        <div className="p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-white">Dashboard</h1>
                <p className="text-slate-400 mt-2">Un resumen del estado actual de su finca.</p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Animal Summary Card */}
                <StatCard title="Resumen de Animales" icon={<CowIcon />}>
                    <div className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg">
                        <span className="font-semibold text-slate-300">Total Animales</span>
                        <span className="text-2xl font-bold text-white">{animalSummary.total}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg">
                        <span className="font-semibold text-slate-300">Hembras / Machos</span>
                        <span className="font-mono text-xl font-semibold text-white">{animalSummary.hembras} / {animalSummary.machos}</span>
                    </div>
                     <div className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg">
                        <span className="font-semibold text-slate-300">Sin Parentesco Registrado</span>
                        <span className="font-mono text-xl font-semibold text-amber-400">{animalSummary.sinParentesco}</span>
                    </div>
                </StatCard>

                {/* Warehouse Alerts Card */}
                <StatCard title="Alertas de Bodega" icon={<BoxIcon />}>
                    <div className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg">
                        <span className="font-semibold text-slate-300">Valor de Inventario</span>
                        <span className="text-xl font-bold text-white">${insumoSummary.valorTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg">
                        <span className="font-semibold text-slate-300">Próximo a Vencer (30d)</span>
                        <span className={`text-xl font-bold ${insumoSummary.proximosAVencer > 0 ? 'text-amber-400' : 'text-white'}`}>{insumoSummary.proximosAVencer}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg">
                        <span className="font-semibold text-slate-300">Productos sin Precio</span>
                        <span className={`text-xl font-bold ${insumoSummary.sinPrecio > 0 ? 'text-red-400' : 'text-white'}`}>{insumoSummary.sinPrecio}</span>
                    </div>
                </StatCard>
                
                 {/* Upcoming Events Card */}
                <div className="lg:col-span-2 xl:col-span-1">
                    <StatCard title="Próximos Eventos" icon={<AlertTriangleIcon />} actions={
                         <button onClick={() => setActiveView('eventos')} className="w-full text-center bg-brand-secondary/80 text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-secondary transition-colors">
                            Ver todos los eventos
                        </button>
                    }>
                        {proximosEventos.length > 0 ? (
                             <div className="space-y-4">
                                {proximosEventos.map(evento => <EventCard key={evento.id} evento={evento} />)}
                            </div>
                        ) : (
                            <div className="text-center text-slate-400 py-6">No hay eventos próximos.</div>
                        )}
                    </StatCard>
                </div>

                {/* Animal Age Chart Card */}
                <div className="lg:col-span-2">
                    <StatCard title="Demografía del Ganado" icon={<BarChartIcon />}>
                       <div style={{ height: '250px' }}>
                         <SimpleBarChart data={animalAgeData} />
                       </div>
                    </StatCard>
                </div>

                {/* Financial Summary Placeholder */}
                 <StatCard title="Resumen Financiero" icon={<MoneyIcon />} actions={
                    <button onClick={() => setActiveView('contabilidad')} className="w-full text-center bg-brand-secondary/80 text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-secondary transition-colors">
                        Ver Contabilidad
                    </button>
                }>
                    <div className="text-center text-slate-400 py-10">Módulo de contabilidad en construcción.</div>
                </StatCard>

            </div>
        </div>
    );
};

export default DashboardView;