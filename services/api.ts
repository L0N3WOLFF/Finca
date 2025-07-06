import { Insumo, MovimientoInsumo, Animal, UnidadMedida, TipoMovimiento, InsumoFormValues, Sexo, AnimalFormValues, Evento, EventoFormValues } from '../types';

// --- MOCK DATABASE ---
let lastInsumoId = 14;
let lastMovimientoId = 0;
let lastAnimalId = 8;
let lastEventoId = 1;

const today = new Date();
const futureDate = (days: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return date;
}

const initialInsumos: Insumo[] = [
    { id: 1, nombre_producto: 'Hemopar B12', tipo_indicacion: 'Solución Inyectable: Controla Anaplasmosis, Tripanosomiasis y Babesiosis', cantidad: 30, unidad_medida: UnidadMedida.mL, precio: 2.95, fecha_caducidad: futureDate(365) },
    { id: 2, nombre_producto: 'Admicing 5%', tipo_indicacion: 'Antibiótico de amplio espectro (Oxitetraciclina, solución inyectable)', cantidad: 20, unidad_medida: UnidadMedida.mL, precio: undefined, fecha_caducidad: futureDate(180) },
    { id: 3, nombre_producto: 'EDO MODIFOR', tipo_indicacion: 'Modificador Orgánico: Vitaminas, Minerales, Aminoácidos, Energia', cantidad: 100, unidad_medida: UnidadMedida.mL, precio: undefined, fecha_caducidad: futureDate(400) },
    { id: 4, nombre_producto: 'Olivitasan®', tipo_indicacion: 'Multivitamínico Tónico - Mineralizante (ADE, Fósforo (ATP), Minerales, Yodo(I), Magnesio(Mg), Cobre(Cu))', cantidad: 100, unidad_medida: UnidadMedida.mL, precio: 12.95, fecha_caducidad: futureDate(300) },
    { id: 5, nombre_producto: 'Dectoplus', tipo_indicacion: 'Doramectina Endectocida', cantidad: 50, unidad_medida: UnidadMedida.mL, precio: 20.95, fecha_caducidad: futureDate(500) },
    { id: 6, nombre_producto: 'Complejo B Forte', tipo_indicacion: 'Solución Inyectable', cantidad: 20, unidad_medida: UnidadMedida.mL, precio: undefined, fecha_caducidad: futureDate(25) },
    { id: 7, nombre_producto: 'Vacuna Rabia Paralítica Interchemio', tipo_indicacion: 'Vacuna Liofilizada', cantidad: 32, unidad_medida: UnidadMedida.mL, precio: undefined, fecha_caducidad: futureDate(90) },
    { id: 8, nombre_producto: 'VIMEC TOP', tipo_indicacion: 'Solución inyectable. Para el tratamiento y control de parásitos internos y externos en bovinos', cantidad: 50, unidad_medida: UnidadMedida.mL, precio: undefined, fecha_caducidad: futureDate(120) },
    { id: 9, nombre_producto: 'EDO GEN', tipo_indicacion: 'Remineralizante: Fósforo, Selenio, Yodo, Sodio, Potasio', cantidad: 100, unidad_medida: UnidadMedida.mL, precio: 12.50, fecha_caducidad: futureDate(60) },
    { id: 10, nombre_producto: 'DOLOFENO', tipo_indicacion: 'Ketoprofeno, Solución inyectable', cantidad: 10, unidad_medida: UnidadMedida.mL, precio: undefined, fecha_caducidad: futureDate(45) },
    { id: 11, nombre_producto: 'CACODIL B-12', tipo_indicacion: 'Solución Inyectable: Complejo B + Cacodilato. Indicado en bovinos, equinos, ovinos, porcinos y caninos', cantidad: 10, unidad_medida: UnidadMedida.mL, precio: undefined, fecha_caducidad: futureDate(75) },
    { id: 12, nombre_producto: 'Jeringa Desechable 5cc', tipo_indicacion: 'Jeringa', cantidad: 15, unidad_medida: UnidadMedida.U, precio: 3.50, fecha_caducidad: futureDate(1000) },
    { id: 13, nombre_producto: 'Aguja 16 x 1 1/2', tipo_indicacion: 'Aguja', cantidad: 15, unidad_medida: UnidadMedida.U, precio: 1.50, fecha_caducidad: futureDate(1000) },
    { id: 14, nombre_producto: 'Sal mineral', tipo_indicacion: 'Mezcla de sales minerales para el ganado.', cantidad: 25, unidad_medida: UnidadMedida.Kg, precio: 9.00, fecha_caducidad: futureDate(730) },
];

let insumos: Insumo[] = [...initialInsumos];
let movimientos: MovimientoInsumo[] = [];

const initialAnimales: Animal[] = [
    { id: 1, numero_arete: 'FULA01', nombre: 'Fula', sexo: Sexo.Hembra, edad: 8, madre: undefined, padre: undefined },
    { id: 2, numero_arete: 'CAN01', nombre: 'Canela', sexo: Sexo.Hembra, edad: 6, madre: undefined, padre: undefined },
    { id: 3, numero_arete: 'NERO01', nombre: 'Nero', sexo: Sexo.Hembra, edad: 6, madre: undefined, padre: undefined },
    { id: 4, numero_arete: 'AFR01', nombre: 'Africa', sexo: Sexo.Hembra, edad: 5, madre: undefined, padre: undefined },
    { id: 5, numero_arete: 'MILY01', nombre: 'Mily', sexo: Sexo.Hembra, edad: 2, madre: 'Fula', padre: 'Torino' },
    { id: 6, numero_arete: 'GORR01', nombre: 'Gorrion', sexo: Sexo.Macho, edad: 1, madre: 'Nero', padre: 'Torino' },
    { id: 7, numero_arete: 'PIM01', nombre: 'Pimienta', sexo: Sexo.Hembra, edad: 1, madre: 'Canela', padre: 'Torino' },
    { id: 8, numero_arete: 'RAYA01', nombre: 'Raya', sexo: Sexo.Hembra, edad: 1, madre: undefined, padre: undefined },
];
let animales: Animal[] = [...initialAnimales];

const initialEventos: Evento[] = [
  { id: 1, titulo: 'Vacunación (pierna negra) y Desparasitación', descripcion: 'Vacunación general del ganado contra pierna negra y desparasitación interna.', fecha: new Date('2025-08-15T09:00:00') },
];
let eventos: Evento[] = [...initialEventos];


// --- API Service Simulation ---
class ApiService {
  private simulateLatency(data: any) {
    return new Promise(resolve => setTimeout(() => resolve(data), 200 + Math.random() * 400));
  }

  // --- Insumo Methods ---
  async getInsumos(): Promise<Insumo[]> {
    return this.simulateLatency([...insumos].sort((a, b) => a.nombre_producto.localeCompare(b.nombre_producto))) as Promise<Insumo[]>;
  }

  async addInsumo(data: InsumoFormValues): Promise<Insumo> {
    const nuevoInsumo: Insumo = {
      ...data,
      id: ++lastInsumoId,
      cantidad: 0, // New products start with 0 stock, must be added via purchase
    };
    insumos.push(nuevoInsumo);
    
    const nuevoMovimiento: MovimientoInsumo = {
        id: ++lastMovimientoId,
        insumoId: nuevoInsumo.id,
        fecha_movimiento: new Date(),
        tipo_movimiento: TipoMovimiento.Ajuste,
        cantidad: 0,
        descripcion: 'Insumo añadido al catálogo.'
    };
    movimientos.push(nuevoMovimiento);

    return this.simulateLatency(nuevoInsumo) as Promise<Insumo>;
  }
  
  async addCompraInsumo(insumoId: number, cantidad: number, descripcion: string): Promise<MovimientoInsumo> {
      const insumo = insumos.find(i => i.id === insumoId);
      if (!insumo) throw new Error("Insumo no encontrado");

      insumo.cantidad += cantidad;
      const nuevoMovimiento: MovimientoInsumo = {
          id: ++lastMovimientoId,
          insumoId: insumoId,
          fecha_movimiento: new Date(),
          tipo_movimiento: TipoMovimiento.EntradaCompra,
          cantidad: cantidad,
          descripcion: descripcion,
      };
      movimientos.push(nuevoMovimiento);
      return this.simulateLatency(nuevoMovimiento) as Promise<MovimientoInsumo>;
  }
  
  async addUsoInsumo(insumoId: number, cantidad: number, animalId: number, descripcion: string): Promise<MovimientoInsumo> {
      const insumo = insumos.find(i => i.id === insumoId);
      if (!insumo) throw new Error("Insumo no encontrado");
      if (insumo.cantidad < cantidad) throw new Error("Stock insuficiente");
      
      const animal = animales.find(a => a.id === animalId);
      if(!animal) throw new Error("Animal no encontrado");

      insumo.cantidad -= cantidad;
      const nuevoMovimiento: MovimientoInsumo = {
          id: ++lastMovimientoId,
          insumoId: insumoId,
          fecha_movimiento: new Date(),
          tipo_movimiento: TipoMovimiento.SalidaUso,
          cantidad: -cantidad,
          descripcion: `${descripcion} (Animal: ${animal.nombre})`,
      };
      movimientos.push(nuevoMovimiento);
      return this.simulateLatency(nuevoMovimiento) as Promise<MovimientoInsumo>;
  }
  
  async getMovimientosByInsumoId(insumoId: number): Promise<MovimientoInsumo[]> {
    const result = movimientos.filter(m => m.insumoId === insumoId).sort((a,b) => b.fecha_movimiento.getTime() - a.fecha_movimiento.getTime());
    return this.simulateLatency(result) as Promise<MovimientoInsumo[]>;
  }

  // --- Animal Methods ---
  async getAnimales(): Promise<Animal[]> {
    return this.simulateLatency([...animales].sort((a, b) => a.nombre.localeCompare(b.nombre))) as Promise<Animal[]>;
  }
  
  async addAnimal(data: AnimalFormValues): Promise<Animal> {
    const nuevoAnimal: Animal = {
        ...data,
        id: ++lastAnimalId,
        madre: data.madre || undefined,
        padre: data.padre || undefined,
    };
    animales.push(nuevoAnimal);
    return this.simulateLatency(nuevoAnimal) as Promise<Animal>;
  }

  // --- Evento Methods ---
  async getEventos(): Promise<Evento[]> {
    const sortedEventos = [...eventos].sort((a, b) => {
        if (a.fecha && b.fecha) return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
        if (a.fecha) return -1;
        if (b.fecha) return 1;
        return a.titulo.localeCompare(b.titulo);
    });
    return this.simulateLatency(sortedEventos) as Promise<Evento[]>;
  }

  async addEvento(data: EventoFormValues): Promise<Evento> {
    const nuevoEvento: Evento = {
      ...data,
      id: ++lastEventoId,
    };
    eventos.push(nuevoEvento);
    return this.simulateLatency(nuevoEvento) as Promise<Evento>;
  }
}

export const api = new ApiService();