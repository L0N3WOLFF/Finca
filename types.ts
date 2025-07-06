
export enum UnidadMedida {
  mL = 'mL',
  U = 'U',
  Kg = 'Kg',
}

export enum TipoMovimiento {
  EntradaCompra = 'Entrada por Compra',
  SalidaUso = 'Salida por Uso',
  Ajuste = 'Ajuste de Inventario',
}

export interface Insumo {
  id: number;
  nombre_producto: string;
  tipo_indicacion: string;
  cantidad: number;
  unidad_medida: UnidadMedida;
  precio?: number;
  fecha_caducidad: Date;
}

export interface MovimientoInsumo {
  id: number;
  insumoId: number;
  fecha_movimiento: Date;
  tipo_movimiento: TipoMovimiento;
  cantidad: number; // Positive for entry, negative for exit
  descripcion:string;
}

export enum Sexo {
  Macho = 'Macho',
  Hembra = 'Hembra',
}

export interface Animal {
    id: number;
    numero_arete: string;
    nombre: string;
    sexo: Sexo;
    edad: number;
    padre?: string;
    madre?: string;
}

export interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  fecha?: Date;
}

export type InsumoFormValues = Omit<Insumo, 'id' | 'cantidad'>;

export type AnimalFormValues = Omit<Animal, 'id'>;

export type EventoFormValues = Omit<Evento, 'id'>;
