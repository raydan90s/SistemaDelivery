# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

# Sistema de Delivery - Delicious Express

Sistema web completo de gestión de pedidos y delivery de comida desarrollado con React, TypeScript y Supabase.

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Módulos Principales](#módulos-principales)
- [Scripts Disponibles](#scripts-disponibles)
- [Guía de Uso](#guía-de-uso)
- [Base de Datos](#base-de-datos)
- [Autores](#autores)

## Características

### Para Clientes
- Catálogo de productos por categorías
- Búsqueda de productos
- Carrito de compras interactivo
- Seguimiento de pedidos en tiempo real
- Gestión de perfil y direcciones
- Múltiples métodos de pago

### Para Administradores
- Panel de administración completo
- Gestión de productos y categorías
- Administración de bodegas e inventario
- Control de clientes y empleados
- Asignación de repartidores
- Reportes y exportación a Excel/CSV
- Carga y compresión automática de imágenes

### Características Técnicas
- Interfaz responsiva (móvil, tablet, desktop)
- Autenticación y autorización por roles
- Soft delete para preservar integridad referencial
- Exportación de datos a Excel/CSV/PDF
- UI/UX moderna con Tailwind CSS
- Actualizaciones en tiempo real con Supabase

## Tecnologías

### Frontend
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router DOM 7** - Navegación
- **Tailwind CSS 4** - Estilos utilitarios

### Backend & Base de Datos
- **Supabase** - Backend-as-a-Service
  - PostgreSQL (base de datos)
  - Auth (autenticación)
  - Storage (almacenamiento de imágenes)
  - Realtime (actualizaciones en tiempo real)

### Bibliotecas Principales
- **Lucide React** - Iconos
- **ExcelJS** - Exportación a Excel
- **jsPDF** - Generación de PDFs
- **browser-image-compression** - Compresión de imágenes

## Requisitos Previos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 o **yarn** >= 1.22.0
- Cuenta en [Supabase](https://supabase.com)

## Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/SistemaDelivery.git
cd SistemaDelivery
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_URL_API=tu_supabase_url
VITE_ANON_KEY=tu_supabase_anon_key
VITE_SERVICE_ROLE_KEY=tu_supabase_service_role_key
```

> ⚠️ **Nota:** Obtén estas credenciales desde tu proyecto de Supabase:
> - Dashboard → Settings → API
> - `VITE_URL_API` = Project URL
> - `VITE_ANON_KEY` = anon/public key
> - `VITE_SERVICE_ROLE_KEY` = service_role key (solo para admin)

4. **Ejecutar el proyecto**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Configuración

### Configuración de Supabase

1. **Crear proyecto en Supabase**
   - Ve a [supabase.com](https://supabase.com)
   - Crea un nuevo proyecto
   - Anota las credenciales

2. **Ejecutar migraciones SQL**
   - Ve a SQL Editor en Supabase
   - Ejecuta los scripts de creación de tablas (ver sección [Base de Datos](#-base-de-datos))

3. **Configurar Storage**
   - Crea un bucket llamado `productos-imagenes`
   - Habilita acceso público
   - Configura políticas RLS si es necesario

4. **Generar tipos TypeScript** (opcional)
```bash
npx supabase gen types typescript --project-id "tu-project-id" > src/types/supabase.ts
```

## Estructura del Proyecto

```
SistemaDelivery/
├── public/                   # Archivos estáticos
├── src/
│   ├── components/           # Componentes React
│   │   ├── admin/           # Componentes del panel admin
│   │   │   ├── SimpleTableAdmin.tsx    # Tabla CRUD reutilizable
│   │   │   ├── ProductosAdmin.tsx
│   │   │   ├── CategoriasProductoAdmin.tsx
│   │   │   └── ...
│   │   ├── Botones/         # Componentes de botones
│   │   ├── Carrito/         # Componentes del carrito
│   │   ├── cliente/         # Componentes del cliente
│   │   └── ProtectedRoute/  # Rutas protegidas
│   ├── context/             # Contextos de React
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── hooks/               # Custom hooks
│   │   ├── useCart.ts
│   │   └── useReport.ts
│   ├── pages/               # Páginas principales
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── Carrito.tsx
│   ├── services/            # Servicios de API
│   │   ├── supabase.ts      # Cliente de Supabase
│   │   ├── productos.ts     # CRUD de productos
│   │   ├── categoriasProducto.ts
│   │   ├── pedido.ts
│   │   └── ...
│   ├── types/               # Definiciones de tipos
│   │   ├── supabase.ts      # Tipos generados de Supabase
│   │   └── index.ts
│   ├── utils/               # Utilidades
│   ├── styles/              # Estilos globales
│   │   └── index.css
│   ├── App.tsx              # Componente principal
│   └── main.tsx             # Punto de entrada
├── .env                     # Variables de entorno (no commitear)
├── .env.example             # Plantilla de variables de entorno
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Módulos Principales

### 1. **Productos**
- Gestión completa de productos (CRUD)
- Categorización por tipos de comida
- Carga de imágenes con compresión automática
- Control de stock mínimo
- Soft delete para preservar historial

**Funcionalidades:**
- `fetchProductos()` - Listar todos los productos activos
- `createProducto()` - Crear nuevo producto
- `updateProducto()` - Actualizar producto existente
- `deleteProducto()` - Eliminación lógica (soft delete)
- `searchProductos()` - Búsqueda por nombre/descripción
- `fetchProductosDestacados()` - Top 8 productos destacados

### 2. **Categorías de Producto**
- Administración de categorías
- Iconos dinámicos por categoría
- Filtrado de productos por categoría

### 3. **Inventario**
- Gestión de bodegas
- Control de movimientos (entradas/salidas)
- Registro de kardex
- Alertas de stock mínimo

### 4. **Pedidos**
- Creación de pedidos desde el carrito
- Asignación automática de repartidores
- Estados de pedido (Pendiente, En proceso, En camino, Entregado)
- Seguimiento en tiempo real
- Generación de facturas

### 5. **Carrito de Compras**
- Agregar/eliminar productos
- Actualizar cantidades
- Persistencia con Context API
- Cálculo automático de totales

### 6. **Autenticación**
- Login/Registro con Supabase Auth
- Roles de usuario (Cliente, Administrador, Empleado)
- Rutas protegidas por rol
- Recuperación de contraseña

### 7. **Panel de Administración**
- Componente reutilizable `SimpleTableAdmin`
- Gestión de 15+ módulos:
  - Productos
  - Categorías
  - Clientes
  - Empleados
  - Repartidores
  - Bodegas
  - Proveedores
  - Estados generales
  - IVA
  - Métodos de pago
  - Tipos de documento
  - Tipos de empleado
  - Tipos de vehículo
  - Unidades de medida
  - Provincias y ciudades

## Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo en localhost:5173

# Producción
npm run build        # Compila para producción en /dist
npm run preview      # Previsualiza build de producción

# Linting
npm run lint         # Ejecuta ESLint para verificar código
```

## Guía de Uso

### Para Clientes

1. **Registro e Inicio de Sesión**
   - Navega a `/register` para crear una cuenta
   - O inicia sesión en `/login` si ya tienes cuenta

2. **Explorar Productos**
   - Navega por categorías en la página principal
   - Usa el buscador para encontrar productos específicos

3. **Agregar al Carrito**
   - Click en el botón `+` para agregar productos
   - Ajusta cantidades con los botones `+` y `-`
   - El carrito se actualiza automáticamente

4. **Realizar Pedido**
   - Ve al carrito (`/carrito`)
   - Verifica productos y cantidades
   - Selecciona dirección de entrega
   - Elige método de pago
   - Confirma el pedido

5. **Seguimiento de Pedidos**
   - Accede a tu perfil (`/perfil`)
   - Sección "Mis Pedidos"
   - Ve el estado en tiempo real

### Para Administradores

1. **Acceso al Panel Admin**
   - Inicia sesión con cuenta de administrador
   - Dashboard disponible en `/admin`

2. **Gestión de Productos**
   - `Admin → Productos`
   - Click en "Nuevo Producto"
   - Llena el formulario (nombre, descripción, precio, categoría, etc.)
   - Sube imagen (se comprime automáticamente)
   - Guardar

3. **Control de Inventario**
   - `Admin → Bodegas` - Gestiona ubicaciones de almacenamiento
   - `Admin → Movimientos` - Registra entradas/salidas
   - Alertas automáticas de stock bajo

4. **Gestión de Pedidos**
   - `Admin → Pedidos`
   - Asigna repartidores
   - Actualiza estados
   - Genera facturas

5. **Reportes**
   - Cualquier tabla admin tiene botones de exportación
   - Click en "Excel" o "CSV" para descargar datos
   - Los reportes incluyen todos los campos visibles

## Base de Datos

### Tablas Principales

#### `productos`
- `id` (bigint, PK)
- `nombre` (varchar)
- `descripcion` (text)
- `imagen_url` (varchar)
- `precio_base` (decimal)
- `stock_minimo` (integer)
- `categoria_id` (FK → categoriasproducto)
- `unidad_medida_id` (FK → unidadesmedida)
- `estado_id` (FK → estados_generales)

#### `categoriasproducto`
- `id` (bigint, PK)
- `nombre` (varchar)
- `descripcion` (text)
- `estado_id` (FK → estados_generales)

#### `pedidos`
- `id` (bigint, PK)
- `cliente_id` (FK → clientes)
- `fecha_pedido` (timestamp)
- `estado_pedido_id` (FK → estadospedido)
- `direccion_entrega_id` (FK → direccionescliente)
- `repartidor_id` (FK → repartidores)
- `tipo_entrega_id` (FK → tipoentrega)
- `metodo_pago_id` (FK → metodospago)
- `total` (decimal)

#### `detallespedido`
- `id` (bigint, PK)
- `pedido_id` (FK → pedidos)
- `producto_id` (FK → productos)
- `cantidad` (integer)
- `precio_unitario` (decimal)
- `subtotal` (decimal)

#### `bodegas`
- `id` (bigint, PK)
- `nombre` (varchar)
- `ubicacion` (varchar)
- `capacidad` (integer)
- `estado_id` (FK → estados_generales)

#### `movimientos`
- `id` (bigint, PK)
- `bodega_id` (FK → bodegas)
- `producto_id` (FK → productos)
- `tipo_movimiento_id` (FK → tipomovimientos)
- `cantidad` (integer)
- `fecha` (timestamp)
- `motivo` (text)

### Patrones de Diseño de BD

1. **Soft Delete**
   - Tablas principales tienen `estado_id` (1 = Activo, 2 = Inactivo)
   - No se eliminan registros físicamente
   - Preserva integridad referencial e historial

2. **Normalización**
   - Uso de tablas catálogo para evitar redundancia
   - Foreign keys para mantener integridad

3. **Auditoría**
   - Timestamps de creación/actualización
   - Registro de movimientos de inventario

## Autores

**Isabella**
- Módulo de Productos
- Módulo de Categorías de Producto
- Sistema de Inventario (Bodegas y Movimientos)
- Componente reutilizable SimpleTableAdmin

**Equipo de Desarrollo**
- Proyecto académico - ESPOL
- Materia: DAWM (Desarrollo de Aplicaciones Web y Móviles)
- Periodo: II PAO 2025

## Licencia

Este proyecto es de código abierto para fines académicos.

---

## Solución de Problemas

### Error: "Supabase client not configured"
- Verifica que el archivo `.env` exista
- Confirma que las variables `VITE_URL_API` y `VITE_ANON_KEY` estén configuradas
- Reinicia el servidor de desarrollo

### Error: "Cannot read property of undefined"
- Verifica la conexión a Supabase
- Asegúrate de que las tablas existan en la BD
- Revisa las políticas RLS (Row Level Security)

### Imágenes no cargan
- Verifica que el bucket `productos-imagenes` exista
- Confirma que el bucket sea público
- Revisa las políticas de Storage en Supabase

### Build falla
```bash
# Limpia node_modules y reinstala
rm -rf node_modules package-lock.json
npm install

# Limpia caché de Vite
rm -rf node_modules/.vite
npm run dev
```

---

## Próximas Mejoras

- [ ] Notificaciones push para clientes
- [ ] Chat en vivo con soporte
- [ ] Programa de puntos/recompensas
- [ ] Integración con pasarelas de pago reales
- [ ] App móvil con React Native
- [ ] Dashboard de analíticas avanzadas
- [ ] Sistema de cupones y descuentos

---

**¿Preguntas o problemas?** Abre un issue en GitHub o contacta al equipo de desarrollo.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
