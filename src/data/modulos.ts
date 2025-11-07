import { Settings, Package, MapPin, DollarSign, FileText, Users, Building2, Percent } from 'lucide-react';
import TipoDocumentoAdmin from '@components/admin/TipoDocumentoAdmin';
import type { ModuleType } from '@models/modulos';
import UnidadMedidaAdmin from '@components/admin/UnidadMedidaAdmin';
import ProvinciasAdmin from '@components/admin/ProvinciaAdmin';
import CiudadesAdmin from '@components/admin/CiudadesAdmin';
import gestionBodegas from '@pages/gestionBodegas';
//import EstadosGeneralesAdmin from './modules/EstadosGeneralesAdmin';
//import MetodoPagoAdmin from './modules/MetodoPagoAdmin';
//import IVAAdmin from './modules/IVAAdmin';
//import ProveedoresAdmin from './modules/ProveedoresAdmin';

const modules = [
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
      //component: EstadosGeneralesAdmin
    },
    {
      id: 'metodopago' as ModuleType,
      name: 'Métodos de Pago',
      description: 'Efectivo, Tarjeta, Transferencia',
      icon: DollarSign,
      color: 'bg-emerald-500',
      //component: MetodoPagoAdmin
    },
    {
      id: 'iva' as ModuleType,
      name: 'IVA',
      description: 'Porcentajes de IVA por fecha',
      icon: Percent,
      color: 'bg-red-500',
      //component: IVAAdmin
    },
    {
      id: 'proveedores' as ModuleType,
      name: 'Proveedores',
      description: 'Gestión de proveedores',
      icon: Users,
      color: 'bg-indigo-500',
      //component: ProveedoresAdmin
    },
    {
      id: 'bodegas' as ModuleType,
      name: 'Bodegas',
      description: 'Gestión de bodegas',
      icon: FileText,
      color: 'bg-blue-500',
      component: gestionBodegas
    },
  ];

export default modules;