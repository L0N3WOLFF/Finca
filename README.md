
# Mi Finca Digital

## Descripción del Proyecto

**Mi Finca Digital** es una aplicación web moderna diseñada para ayudar a los agricultores y ganaderos a gestionar eficientemente las operaciones diarias de su finca. La aplicación proporciona una interfaz limpia e intuitiva para realizar un seguimiento del inventario de insumos y animales, gestionar eventos importantes y obtener una visión general rápida del estado de la finca a través de un dashboard dinámico.

Esta es una aplicación frontend sin un backend real; utiliza un servicio de API simulado para demostrar la funcionalidad completa.

---

## Características Principales

La aplicación está organizada en varios módulos clave:

### 1. **Dashboard (Panel de Control)**
El centro neurálgico de la aplicación, que ofrece un resumen visual del estado de la finca:
- **Resumen de Animales:** Tarjeta con el recuento total de animales, distribución por sexo y un indicador de animales sin parentesco registrado.
- **Alertas de Bodega:** Muestra el valor total estimado del inventario, el número de productos próximos a vencer y aquellos sin precio asignado.
- **Próximos Eventos:** Una lista de los eventos más cercanos en el tiempo.
- **Demografía del Ganado:** Un gráfico de barras que visualiza la distribución de los animales por grupos de edad (Terneros, Jóvenes, Adultos).
- **Resumen Financiero:** Un marcador de posición para la futura integración del módulo de contabilidad.

### 2. **Insumos y Bodega (Suministros y Almacén)**
Gestión completa del inventario de suministros de la finca:
- **Tabla de Inventario Detallada:** Muestra productos con cantidad, unidad, precio y fecha de caducidad.
- **Estado Dinámico del Producto:** Los productos se etiquetan automáticamente como "Bueno", "Próximo a Vencer" (resaltado en amarillo) o "Vencido" (resaltado en rojo).
- **Gestión de Movimientos:** Modales para registrar fácilmente compras (entradas) y usos (salidas) de productos.
- **Historial por Producto:** Posibilidad de ver el historial completo de movimientos para cada insumo.
- **Catálogo de Productos:** Permite añadir nuevos tipos de insumos al sistema.

### 3. **Animales (Inventario de Ganado)**
Un registro completo de todo el ganado de la finca:
- **Tabla de Animales:** Lista todos los animales con su número de arete, nombre, sexo, edad y parentesco (madre/padre).
- **Añadir Nuevos Animales:** Un formulario modal simplificado para registrar nuevos animales en el inventario.

### 4. **Eventos (Gestión de Eventos)**
Para planificar y realizar un seguimiento de las actividades importantes de la finca:
- **Vista de Tarjetas de Eventos:** Muestra todos los eventos programados y pendientes en un diseño de tarjeta visual.
- **Creación de Eventos:** Permite añadir nuevos eventos con título, descripción y una fecha opcional.

### 5. **Contabilidad (Módulo Futuro)**
Una sección preparada para la futura implementación de la gestión financiera.

---

## Stack Tecnológico

- **Frontend:**
  - **Framework:** React 19
  - **Lenguaje:** TypeScript
  - **Estilos:** Tailwind CSS
- **Dependencias:**
  - Las dependencias de React se cargan directamente en el navegador a través de `esm.sh` (definido en `index.html`), eliminando la necesidad de un paso de compilación o un gestor de paquetes como npm/yarn en este entorno.

---

## Estructura del Proyecto

El código fuente está organizado de la siguiente manera para promover la modularidad y la legibilidad:

```
/
├── public/
├── src/
│   ├── components/      # Componentes de UI reutilizables (Modal, Iconos, Gráficos, etc.)
│   │   ├── charts/
│   │   └── icons/
│   ├── services/        # API simulada (api.ts) para la gestión de datos en memoria.
│   ├── views/           # Componentes de vista principales para cada sección (Dashboard, Bodega, etc.).
│   ├── App.tsx          # Componente raíz que gestiona la navegación y el layout.
│   ├── index.tsx        # Punto de entrada de React.
│   └── types.ts         # Definiciones de tipos de TypeScript para toda la aplicación.
├── .gitignore
├── index.html         # Archivo HTML principal, carga de scripts y configuración de Tailwind.
├── metadata.json
└── README.md
```

---

## Cómo Empezar

Esta aplicación está diseñada para ejecutarse en un entorno de desarrollo web que soporte directamente módulos ES6 y la importación de dependencias desde una CDN.

1.  **No se requiere instalación:** No es necesario ejecutar `npm install` o `yarn`, ya que todas las dependencias se obtienen de una CDN.
2.  **Ejecutar:** Simplemente sirva los archivos a través de un servidor web local. La mayoría de los editores de código y herramientas de desarrollo (como VS Code con la extensión Live Server) pueden hacer esto.
3.  **Abrir en el Navegador:** Una vez servido, abra la URL proporcionada (generalmente algo como `http://localhost:5500`) en su navegador.

---

## Hoja de Ruta (Roadmap) y Mejoras Futuras

- **Implementar el Módulo de Contabilidad:** Desarrollar la funcionalidad completa para el seguimiento de ingresos y gastos.
- **Funcionalidades de Edición y Eliminación:** Añadir la capacidad de editar y eliminar registros existentes (animales, insumos, eventos).
- **Conexión a un Backend Real:** Reemplazar la API simulada con una API real conectada a una base de datos (como PostgreSQL, Firebase, etc.).
- **Autenticación de Usuarios:** Añadir un sistema de inicio de sesión para proteger los datos de la finca.
- **Informes y Análisis Avanzados:** Generar informes exportables sobre el inventario, la salud del ganado y las finanzas.
