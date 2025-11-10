// src/components/admin/UserRolesAdmin.tsx
import { supabase } from '@services/supabase';
import SimpleTableAdmin from '@components/admin/SimpleTableAdmin';
import type { ModuleType } from '@models/modulos';
import { modules as allModules } from '@data/modulos';

interface Usuario {
  id: number;
  nombre: string;
  apellido?: string | null;
  celular?: string | null;
  estado_id?: number | null;
  auth_user_id?: string | null;
  rol_id: number | null;
  rol_nombre?: string | null;
  permisos?: ModuleType[];
}

interface UsuarioInsert {
  nombre: string;
  rol_id: number;
  permisos?: ModuleType[];
}

interface UsuarioUpdate {
  nombre?: string;
  rol_id?: number;
  permisos?: ModuleType[];
}

// Tipo de columna que permite render opcional
type Column<T> = { 
  key: keyof T; 
  label: string; 
  render?: (value: any, item?: T) => React.ReactNode; 
};

type Field = { 
  name: string; 
  label: string; 
  type: 'text' | 'select'; 
  required?: boolean; 
  fetchOptions?: () => Promise<{ value: any; label: string }[]>; 
};

type CrudOperations<T, Insert, Update> = {
  fetch: () => Promise<T[]>;
  create: (item: Insert) => Promise<T>;
  update: (id: number, item: Update) => Promise<T>;
  delete: (id: number) => Promise<boolean>;
};

export default function UserRolesAdmin() {
  const operations: CrudOperations<Usuario, UsuarioInsert, UsuarioUpdate> = {
    fetch: async () => {
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, nombre, rol_id, permisos, rol:roles(nombre)')
        .order('id', { ascending: true });

      if (error) throw error;

      // Forzamos tipo para evitar errores TS
      return (data as any[]).map(u => ({
        id: u.id,
        nombre: u.nombre,
        rol_id: u.rol_id,
        permisos: u.permisos ?? [],
        rol_nombre: u.rol?.nombre ?? null,
      })) as Usuario[];
    },
    create: async (item) => {
      const { data, error } = await supabase.from('usuarios').insert(item).select().single();
      if (error) throw error;
      return data;
    },
    update: async (id, item) => {
      const { data, error } = await supabase.from('usuarios').update(item).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    delete: async (id) => {
      const { error } = await supabase.from('usuarios').delete().eq('id', id);
      if (error) throw error;
      return true;
    },
  };

  const fields: Field[] = [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
    { 
      name: 'rol_id', 
      label: 'Rol', 
      type: 'select', 
      required: true, 
      fetchOptions: async () => {
        const { data, error } = await supabase.from('roles').select('id, nombre');
        if (error) return [];
        return data.map(r => ({ value: r.id, label: r.nombre }));
      }
    }
  ];

  const columns: Column<Usuario>[] = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'rol_nombre', label: 'Rol' },
    { 
      key: 'permisos', 
      label: 'Permisos', 
      render: (value: ModuleType[]) => (value || []).join(', ') 
    },
  ];

  const getFormData = (formValues: Record<string, any>) => ({
    nombre: formValues.nombre,
    rol_id: Number(formValues.rol_id),
    permisos: formValues.permissions || [],
  });

  const getInitialFormData = (item?: Usuario) => ({
    nombre: item?.nombre ?? '',
    rol_id: item?.rol_id ?? '',
    permissions: item?.permisos || [],
  });

  return (
    <SimpleTableAdmin<Usuario, UsuarioInsert, UsuarioUpdate>
      title="Roles de Usuarios"
      description="Administración de los roles y permisos de los usuarios del sistema"
      buttonLabel="Nuevo Usuario"
      fields={fields}
      columns={columns}
      operations={operations}
      searchFields={['nombre','rol_nombre']}
      getFormData={getFormData}
      getInitialFormData={getInitialFormData}
      enableExport={true}
      hideCreateButton={true}
      customActions={(item) => null} // puedes añadir acciones extra aquí si quieres
    />
  );
}
