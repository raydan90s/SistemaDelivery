import { Settings, Package, MapPin, DollarSign, FileText, Users, Building2, Percent, ShoppingBag, Tags, Gift, Truck, Car, Box } from 'lucide-react';
import TipoDocumentoAdmin from '@components/admin/TipoDocumentoAdmin';
import type { ModuleType } from '@models/modulos';
import UnidadMedidaAdmin from '@components/admin/UnidadMedidaAdmin';
import ProvinciasAdmin from '@components/admin/ProvinciaAdmin';
import CiudadesAdmin from '@components/admin/CiudadesAdmin';
import ProductosAdmin from '@components/admin/ProductosAdmin';
import CategoriasProductoAdmin from '@components/admin/CategoriasProductoAdmin';
import PromocionesAdminAvanzado from '@components/admin/PromocionesAdminAvanzado';
import IVAAdmin from '@components/admin/IVAAdmin';
import ProveedoresAdmin from '@components/admin/ProveedoresAdmin';
import EstadosGeneralesAdmin from '@components/admin/EstadosGeneralesAdmin';
import MetodosPagoAdmin from '@components/admin/MetodosPagoAdmin';
import EmpleadosAdmin from '@components/admin/EmpleadosAdmin';
import TipoEmpleadosAdmin from '@components/admin/TipoEmpleadoAdmin';
import RepartidoresAdmin from '@components/admin/RepartidoresAdmin';
import TipoVehiculoAdmin from '@components/admin/TipoVehiculoAdmin';
import PedidoAdmin from '@components/admin/PedidoAdmin';


export const  modules = [
  {
    id: 'tipodocumento' as ModuleType,
    name: 'Tipos de Documento',
    description: 'Cédula, RUC, Pasaporte',
    icon: FileText,
    color: 'bg-blue-500',
    component: TipoDocumentoAdmin
  },
  {
    id: 'unidadmedida' as ModuleType,
    name: 'Unidades de Medida',
    description: 'ml, gr, tabletas, unidades',
    icon: Package,
    color: 'bg-green-500',
    component: UnidadMedidaAdmin
  },
  {
    id: 'provincias' as ModuleType,
    name: 'Provincias',
    description: 'Provincias del Ecuador',
    icon: MapPin,
    color: 'bg-purple-500',
    component: ProvinciasAdmin
  },
  {
    id: 'ciudades' as ModuleType,
    name: 'Ciudades',
    description: 'Ciudades por provincia',
    icon: Building2,
    color: 'bg-orange-500',
    component: CiudadesAdmin
  },
  {
    id: 'estados' as ModuleType,
    name: 'Estados Generales',
    description: 'Activo, Inactivo, Eliminado',
    icon: Settings,
    color: 'bg-gray-500',
    component: EstadosGeneralesAdmin
  },
  {
    id: 'metodopago' as ModuleType,
    name: 'Métodos de Pago',
    description: 'Efectivo, Tarjeta, Transferencia',
    icon: DollarSign,
    color: 'bg-emerald-500',
    component: MetodosPagoAdmin
  },
  {
    id: 'iva' as ModuleType,
    name: 'IVA',
    description: 'Porcentajes de IVA por fecha',
    icon: Percent,
    color: 'bg-red-500',
    component: IVAAdmin
  },
  {
    id: 'proveedores' as ModuleType,
    name: 'Proveedores',
    description: 'Gestión de proveedores',
    icon: Users,
    color: 'bg-indigo-500',
    component: ProveedoresAdmin
  },
  {
    id: 'productos' as ModuleType,
    name: 'Productos',
    description: 'Gestión de productos del menú',
    icon: ShoppingBag,
    color: 'bg-yellow-500',
    component: ProductosAdmin
  },
  {
    id: 'categorias-producto' as ModuleType,
    name: 'Categorías de Producto',
    description: 'Bebidas, Platos fuertes, Entradas, Postres',
    icon: Tags,
    color: 'bg-pink-500',
    component: CategoriasProductoAdmin
  },
  {
    id: 'promociones' as ModuleType,
    name: 'Promociones',
    description: 'Combos y ofertas con descuentos',
    icon: Gift,
    color: 'bg-cyan-500',
    component: PromocionesAdminAvanzado
  },
  {
    id: 'empleados' as ModuleType,
    name: 'Empleados',
    description: 'Gestión de Empleados',
    icon: Users,
    color: 'bg-indigo-500',
    component: EmpleadosAdmin
  },
  {
    id: 'tipoEmpleado' as ModuleType,
    name: 'Tipo de Empleados',
    description: 'Gestión de Empleados',
    icon: Settings,
    color: 'bg-indigo-500',
    component: TipoEmpleadosAdmin
  },
  {
    id: "repartidores" as ModuleType,
    name: "Repartidores",
    description: "Personal de reparto y delivery",
    icon: Truck,
    color: "bg-blue-600",
    component: RepartidoresAdmin,
  },
  {
    id: "tipovehiculo" as ModuleType,
    name: "Tipos de Vehículo",
    description: "Motocicleta, Bicicleta, Automóvil",
    icon: Car,
    color: "bg-cyan-500",
    component: TipoVehiculoAdmin,
  },
  {
        id: 'pedidoAdmin',  
        name: 'Pedidos', 
        description: 'Gestión de pedidos',
        icon: Box,  
        color: 'bg-blue-500', 
        component: PedidoAdmin,  
    },
]

