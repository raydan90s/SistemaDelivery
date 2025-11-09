import { supabase } from '@services/supabase';
import SimpleTableAdmin from '@components/admin/SimpleTableAdmin';

interface Usuario {
  id: number;
  nombre: string;
  apellido?: string | null;
  celular?: string | null;
  estado_id?: number | null;
  auth_user_id?: string | null;
  rol_id: number | null;
  rol_nombre?: string | null;
}

interface UsuarioInsert {
  nombre: string;
  rol_id: number;
}

interface UsuarioUpdate {
  nombre?: string;
  rol_id?: number;
}

type Column<T> = { key: keyof T; label: string };
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
        .select('id, nombre, rol_id, rol:roles(nombre)')
        .order('id', { ascending: true });
      if (error) throw error;
      return data.map(u => ({ ...u, rol_nombre: u.rol?.nombre }));
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
    }
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
  ];

  const getFormData = (formValues: Record<string, any>) => ({
    nombre: formValues.nombre,
    rol_id: Number(formValues.rol_id),
  });

  const getInitialFormData = (item?: Usuario) => ({
    nombre: item?.nombre ?? '',
    rol_id: item?.rol_id ?? '',
  });

  return (
  <SimpleTableAdmin<Usuario, UsuarioInsert, UsuarioUpdate>
    title="Roles de Usuarios"
    description="Administración de los roles de los usuarios del sistema"
    buttonLabel="Nuevo Usuario"
    hideCreateButton={true}  // <-- botón oculto
    fields={fields}
    columns={columns}
    operations={operations}
    searchFields={['nombre','rol_nombre']}
    getFormData={getFormData}
    getInitialFormData={getInitialFormData}
  />
);
}
