export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bodegas: {
        Row: {
          estado_id: number | null
          id: number
          nombre: string
          ubicacion: string | null
        }
        Insert: {
          estado_id?: number | null
          id?: number
          nombre: string
          ubicacion?: string | null
        }
        Update: {
          estado_id?: number | null
          id?: number
          nombre?: string
          ubicacion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bodegas_ibfk_1"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados_generales"
            referencedColumns: ["id"]
          },
        ]
      }
      categoriasproducto: {
        Row: {
          descripcion: string | null
          estado_id: number | null
          id: number
          nombre: string
        }
        Insert: {
          descripcion?: string | null
          estado_id?: number | null
          id?: number
          nombre: string
        }
        Update: {
          descripcion?: string | null
          estado_id?: number | null
          id?: number
          nombre?: string
        }
        Relationships: [
          {
            foreignKeyName: "categoriasproducto_ibfk_1"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados_generales"
            referencedColumns: ["id"]
          },
        ]
      }
      ciudades: {
        Row: {
          id: number
          nombre: string
          provincia_id: number | null
        }
        Insert: {
          id?: number
          nombre: string
          provincia_id?: number | null
        }
        Update: {
          id?: number
          nombre?: string
          provincia_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ciudades_ibfk_1"
            columns: ["provincia_id"]
            isOneToOne: false
            referencedRelation: "provincias"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          estado_id: number | null
          id: number
          numero_documento: string | null
          tipo_cliente_id: number | null
          tipo_documento_id: number | null
          usuario_id: number | null
        }
        Insert: {
          estado_id?: number | null
          id?: number
          numero_documento?: string | null
          tipo_cliente_id?: number | null
          tipo_documento_id?: number | null
          usuario_id?: number | null
        }
        Update: {
          estado_id?: number | null
          id?: number
          numero_documento?: string | null
          tipo_cliente_id?: number | null
          tipo_documento_id?: number | null
          usuario_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_ibfk_1"
            columns: ["tipo_cliente_id"]
            isOneToOne: false
            referencedRelation: "tipocliente"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clientes_ibfk_2"
            columns: ["tipo_documento_id"]
            isOneToOne: false
            referencedRelation: "tipodocumento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clientes_ibfk_3"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados_generales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clientes_ibfk_usuario"
            columns: ["usuario_id"]
            isOneToOne: true
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      detallefactura: {
        Row: {
          cantidad: number
          factura_id: number | null
          id: number
          precio: number
          producto_nombre: string
          subtotal: number
        }
        Insert: {
          cantidad: number
          factura_id?: number | null
          id?: number
          precio: number
          producto_nombre: string
          subtotal: number
        }
        Update: {
          cantidad?: number
          factura_id?: number | null
          id?: number
          precio?: number
          producto_nombre?: string
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "detallefactura_ibfk_1"
            columns: ["factura_id"]
            isOneToOne: false
            referencedRelation: "factura"
            referencedColumns: ["id"]
          },
        ]
      }
      detallepedido: {
        Row: {
          cantidad: number
          id: number
          pedido_id: number | null
          precio: number
          producto_id: number | null
          subtotal: number
        }
        Insert: {
          cantidad: number
          id?: number
          pedido_id?: number | null
          precio: number
          producto_id?: number | null
          subtotal: number
        }
        Update: {
          cantidad?: number
          id?: number
          pedido_id?: number | null
          precio?: number
          producto_id?: number | null
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "detallepedido_ibfk_1"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "detallepedido_ibfk_2"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      direccionescliente: {
        Row: {
          ciudad_id: number | null
          cliente_id: number | null
          codigo_postal: string | null
          direccion: string
          estado_id: number | null
          id: number
          provincia_id: number | null
          referencias: string | null
        }
        Insert: {
          ciudad_id?: number | null
          cliente_id?: number | null
          codigo_postal?: string | null
          direccion: string
          estado_id?: number | null
          id?: number
          provincia_id?: number | null
          referencias?: string | null
        }
        Update: {
          ciudad_id?: number | null
          cliente_id?: number | null
          codigo_postal?: string | null
          direccion?: string
          estado_id?: number | null
          id?: number
          provincia_id?: number | null
          referencias?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "direccionescliente_ibfk_1"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "direccionescliente_ibfk_2"
            columns: ["ciudad_id"]
            isOneToOne: false
            referencedRelation: "ciudades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "direccionescliente_ibfk_3"
            columns: ["provincia_id"]
            isOneToOne: false
            referencedRelation: "provincias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "direccionescliente_ibfk_4"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados_generales"
            referencedColumns: ["id"]
          },
        ]
      }
      empleados: {
        Row: {
          estado_id: number | null
          id: number
          tipo_empleado_id: number | null
          usuario_id: number | null
        }
        Insert: {
          estado_id?: number | null
          id?: number
          tipo_empleado_id?: number | null
          usuario_id?: number | null
        }
        Update: {
          estado_id?: number | null
          id?: number
          tipo_empleado_id?: number | null
          usuario_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "empleados_ibfk_1"
            columns: ["tipo_empleado_id"]
            isOneToOne: false
            referencedRelation: "tipoempleado"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_ibfk_2"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados_generales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empleados_ibfk_usuario"
            columns: ["usuario_id"]
            isOneToOne: true
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      estados_generales: {
        Row: {
          descripcion: string
          id: number
        }
        Insert: {
          descripcion: string
          id?: number
        }
        Update: {
          descripcion?: string
          id?: number
        }
        Relationships: []
      }
      estadospedido: {
        Row: {
          descripcion: string
          estado_id: number | null
          id: number
        }
        Insert: {
          descripcion: string
          estado_id?: number | null
          id?: number
        }
        Update: {
          descripcion?: string
          estado_id?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "estadospedido_ibfk_1"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados_generales"
            referencedColumns: ["id"]
          },
        ]
      }
      factura: {
        Row: {
          cliente_id: number | null
          estado_id: number | null
          fecha: string
          id: number
          iva_id: number | null
          metodo_pago_id: number | null
          pedido_id: number | null
          total: number
        }
        Insert: {
          cliente_id?: number | null
          estado_id?: number | null
          fecha: string
          id?: number
          iva_id?: number | null
          metodo_pago_id?: number | null
          pedido_id?: number | null
          total: number
        }
        Update: {
          cliente_id?: number | null
          estado_id?: number | null
          fecha?: string
          id?: number
          iva_id?: number | null
          metodo_pago_id?: number | null
          pedido_id?: number | null
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "factura_ibfk_1"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factura_ibfk_2"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factura_ibfk_3"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados_generales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factura_ibfk_4"
            columns: ["metodo_pago_id"]
            isOneToOne: false
            referencedRelation: "metodopago"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factura_ibfk_5"
            columns: ["iva_id"]
            isOneToOne: false
            referencedRelation: "iva"
            referencedColumns: ["id"]
          },
        ]
      }
      iva: {
        Row: {
          estado_id: number | null
          fecha_aplicacion: string
          id: number
          porcentaje: number
        }
        Insert: {
          estado_id?: number | null
          fecha_aplicacion: string
          id?: number
          porcentaje: number
        }
        Update: {
          estado_id?: number | null
          fecha_aplicacion?: string
          id?: number
          porcentaje?: number
        }
        Relationships: [
          {
            foreignKeyName: "iva_ibfk_1"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados_generales"
            referencedColumns: ["id"]
          },
        ]
      }
      metodopago: {
        Row: {
          descripcion: string
          estado_id: number | null
          id: number
        }
        Insert: {
          descripcion: string
          estado_id?: number | null
          id?: number
        }
        Update: {
          descripcion?: string
          estado_id?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "metodopago_ibfk_1"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados_generales"
            referencedColumns: ["id"]
          },
        ]
      }
      movimientos: {
        Row: {
          bodega_id: number | null
          cantidad: number
          empleado_id: number | null
          estado_id: number | null
          fecha: string
          id: number
          observaciones: string | null
          producto_id: number | null
          tipo_movimiento_id: number | null
        }
        Insert: {
          bodega_id?: number | null
          cantidad: number
          empleado_id?: number | null
          estado_id?: number | null
          fecha: string
          id?: number
          observaciones?: string | null
          producto_id?: number | null
          tipo_movimiento_id?: number | null
        }
        Update: {
          bodega_id?: number | null
          cantidad?: number
          empleado_id?: number | null
          estado_id?: number | null
          fecha?: string
          id?: number
          observaciones?: string | null
          producto_id?: number | null
          tipo_movimiento_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "movimientos_ibfk_1"
            columns: ["bodega_id"]
            isOneToOne: false
            referencedRelation: "bodegas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimientos_ibfk_2"
            columns: ["tipo_movimiento_id"]
            isOneToOne: false
            referencedRelation: "tipomovimiento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimientos_ibfk_3"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimientos_ibfk_4"
            columns: ["empleado_id"]
            isOneToOne: false
            referencedRelation: "empleados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "movimientos_ibfk_5"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados_generales"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          cliente_id: number | null
          estado_id: number | null
          estado_pedido_id: number | null
          fecha: string
          id: number
          repartidor_id: number | null
          tipo_entrega_id: number | null
          total: number
        }
        Insert: {
          cliente_id?: number | null
          estado_id?: number | null
          estado_pedido_id?: number | null
          fecha: string
          id?: number
          repartidor_id?: number | null
          tipo_entrega_id?: number | null
          total: number
        }
        Update: {
          cliente_id?: number | null
          estado_id?: number | null
          estado_pedido_id?: number | null
          fecha?: string
          id?: number
          repartidor_id?: number | null
          tipo_entrega_id?: number | null
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_ibfk_1"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_ibfk_2"
            columns: ["estado_pedido_id"]
            isOneToOne: false
            referencedRelation: "estadospedido"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_ibfk_3"
            columns: ["tipo_entrega_id"]
            isOneToOne: false
            referencedRelation: "tipoentrega"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_ibfk_4"
            columns: ["repartidor_id"]
            isOneToOne: false
            referencedRelation: "repartidores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_ibfk_5"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados_generales"
            referencedColumns: ["id"]
          },
        ]
      }
      permisos: {
        Row: {
          accion: string
          estado_id: number | null
          id: number
          pantalla: string
          rol_id: number | null
        }
        Insert: {
          accion: string
          estado_id?: number | null
          id?: number
          pantalla: string
          rol_id?: number | null
        }
        Update: {
          accion?: string
          estado_id?: number | null
          id?: number
          pantalla?: string
          rol_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "permisos_ibfk_1"
            columns: ["rol_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permisos_ibfk_2"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados_generales"
            referencedColumns: ["id"]
          },
        ]
      }
      productos: {
        Row: {
          categoria_id: number | null
          descripcion: string | null
          estado_id: number | null
          id: number
          imagen_url: string | null
          nombre: string
          precio_base: number
          stock_minimo: number | null
          unidad_medida_id: number | null
        }
        Insert: {
          categoria_id?: number | null
          descripcion?: string | null
          estado_id?: number | null
          id?: number
          imagen_url?: string | null
          nombre: string
          precio_base: number
          stock_minimo?: number | null
          unidad_medida_id?: number | null
        }
        Update: {
          categoria_id?: number | null
          descripcion?: string | null
          estado_id?: number | null
          id?: number
          imagen_url?: string | null
          nombre?: string
          precio_base?: number
          stock_minimo?: number | null
          unidad_medida_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "productos_ibfk_1"
            columns: ["unidad_medida_id"]
            isOneToOne: false
            referencedRelation: "unidadmedida"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "productos_ibfk_2"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categoriasproducto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "productos_ibfk_3"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados_generales"
            referencedColumns: ["id"]
          },
        ]
      }
      promociones: {
        Row: {
          descripcion: string | null
          descuento: number | null
          estado_id: number | null
          fecha_fin: string | null
          fecha_inicio: string | null
          id: number
          imagen_url: string | null
          nombre: string
        }
        Insert: {
          descripcion?: string | null
          descuento?: number | null
          estado_id?: number | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          id?: number
          imagen_url?: string | null
          nombre: string
        }
        Update: {
          descripcion?: string | null
          descuento?: number | null
          estado_id?: number | null
          fecha_fin?: string | null
          fecha_inicio?: string | null
          id?: number
          imagen_url?: string | null
          nombre?: string
        }
        Relationships: [
          {
            foreignKeyName: "promociones_ibfk_1"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados_generales"
            referencedColumns: ["id"]
          },
        ]
      }
      promocionesproductos: {
        Row: {
          cantidad: number
          id: number
          producto_id: number | null
          promocion_id: number | null
        }
        Insert: {
          cantidad: number
          id?: number
          producto_id?: number | null
          promocion_id?: number | null
        }
        Update: {
          cantidad?: number
          id?: number
          producto_id?: number | null
          promocion_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "promocionesproductos_ibfk_1"
            columns: ["promocion_id"]
            isOneToOne: false
            referencedRelation: "promociones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promocionesproductos_ibfk_2"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      proveedores: {
        Row: {
          contacto: string | null
          correo: string | null
          direccion: string | null
          estado_id: number | null
          id: number
          nombre: string
          provincia_id: number | null
          telefono: string | null
        }
        Insert: {
          contacto?: string | null
          correo?: string | null
          direccion?: string | null
          estado_id?: number | null
          id?: number
          nombre: string
          provincia_id?: number | null
          telefono?: string | null
        }
        Update: {
          contacto?: string | null
          correo?: string | null
          direccion?: string | null
          estado_id?: number | null
          id?: number
          nombre?: string
          provincia_id?: number | null
          telefono?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proveedores_ibfk_1"
            columns: ["provincia_id"]
            isOneToOne: false
            referencedRelation: "provincias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proveedores_ibfk_2"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados_generales"
            referencedColumns: ["id"]
          },
        ]
      }
      provincias: {
        Row: {
          id: number
          nombre: string
        }
        Insert: {
          id?: number
          nombre: string
        }
        Update: {
          id?: number
          nombre?: string
        }
        Relationships: []
      }
      repartidores: {
        Row: {
          apellido: string | null
          estado_id: number | null
          id: number
          nombre: string
          telefono: string | null
          tipo_vehiculo_id: number | null
        }
        Insert: {
          apellido?: string | null
          estado_id?: number | null
          id?: number
          nombre: string
          telefono?: string | null
          tipo_vehiculo_id?: number | null
        }
        Update: {
          apellido?: string | null
          estado_id?: number | null
          id?: number
          nombre?: string
          telefono?: string | null
          tipo_vehiculo_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "repartidores_ibfk_1"
            columns: ["tipo_vehiculo_id"]
            isOneToOne: false
            referencedRelation: "tipovehiculo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repartidores_ibfk_2"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados_generales"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          descripcion: string | null
          estado_id: number | null
          id: number
          nombre: string
        }
        Insert: {
          descripcion?: string | null
          estado_id?: number | null
          id?: number
          nombre: string
        }
        Update: {
          descripcion?: string | null
          estado_id?: number | null
          id?: number
          nombre?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_ibfk_1"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados_generales"
            referencedColumns: ["id"]
          },
        ]
      }
      tipocliente: {
        Row: {
          descripcion: string
          estado_id: number | null
          id: number
        }
        Insert: {
          descripcion: string
          estado_id?: number | null
          id?: number
        }
        Update: {
          descripcion?: string
          estado_id?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tipocliente_ibfk_1"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados_generales"
            referencedColumns: ["id"]
          },
        ]
      }
      tipodocumento: {
        Row: {
          descripcion: string
          id: number
        }
        Insert: {
          descripcion: string
          id?: number
        }
        Update: {
          descripcion?: string
          id?: number
        }
        Relationships: []
      }
      tipoempleado: {
        Row: {
          descripcion: string
          estado_id: number | null
          id: number
        }
        Insert: {
          descripcion: string
          estado_id?: number | null
          id?: number
        }
        Update: {
          descripcion?: string
          estado_id?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tipoempleado_ibfk_1"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados_generales"
            referencedColumns: ["id"]
          },
        ]
      }
      tipoentrega: {
        Row: {
          descripcion: string
          estado_id: number | null
          id: number
        }
        Insert: {
          descripcion: string
          estado_id?: number | null
          id?: number
        }
        Update: {
          descripcion?: string
          estado_id?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tipoentrega_ibfk_1"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados_generales"
            referencedColumns: ["id"]
          },
        ]
      }
      tipomovimiento: {
        Row: {
          descripcion: string
          estado_id: number | null
          id: number
        }
        Insert: {
          descripcion: string
          estado_id?: number | null
          id?: number
        }
        Update: {
          descripcion?: string
          estado_id?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tipomovimiento_ibfk_1"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados_generales"
            referencedColumns: ["id"]
          },
        ]
      }
      tipovehiculo: {
        Row: {
          descripcion: string
          estado_id: number | null
          id: number
        }
        Insert: {
          descripcion: string
          estado_id?: number | null
          id?: number
        }
        Update: {
          descripcion?: string
          estado_id?: number | null
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tipovehiculo_ibfk_1"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados_generales"
            referencedColumns: ["id"]
          },
        ]
      }
      unidadmedida: {
        Row: {
          descripcion: string
          id: number
        }
        Insert: {
          descripcion: string
          id?: number
        }
        Update: {
          descripcion?: string
          id?: number
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          apellido: string | null
          auth_user_id: string | null
          celular: string | null
          estado_id: number | null
          id: number
          nombre: string
          rol_id: number | null
        }
        Insert: {
          apellido?: string | null
          auth_user_id?: string | null
          celular?: string | null
          estado_id?: number | null
          id?: number
          nombre: string
          rol_id?: number | null
        }
        Update: {
          apellido?: string | null
          auth_user_id?: string | null
          celular?: string | null
          estado_id?: number | null
          id?: number
          nombre?: string
          rol_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_ibfk_2"
            columns: ["rol_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_ibfk_3"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados_generales"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_teams_for_user: {
        Args: { user_id: string }
        Returns: {
          team_id: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
