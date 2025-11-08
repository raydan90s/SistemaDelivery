import { supabase } from '@services/supabase';
import type { Database } from '@models/supabase';
import { createDetalleFactura } from '@services/detalleFacturaService';

type Factura = Database['public']['Tables']['factura']['Row'];
type FacturaInsert = Database['public']['Tables']['factura']['Insert'];
type FacturaUpdate = Database['public']['Tables']['factura']['Update'];

const ESTADO_ACTIVO = 1;
const ESTADO_INACTIVO = 2;

export async function fetchFacturas() {
  const { data, error } = await supabase
    .from('factura')
    .select(`
      *,
      cliente:clientes (id, nombre, apellido, numero_documento),
      metodopago (id, descripcion),
      iva (id, porcentaje),
      pedidos (id),
      estados_generales (id, descripcion)
    `)
    .order('fecha', { ascending: false });

  if (error) {
    console.error('Error al obtener facturas:', error);
    throw error;
  }

  return data as any[];
}


export async function fetchFacturaById(id: number) {
  // Obtener la factura general
  const { data: factura, error: errorFactura } = await supabase
    .from('factura')
    .select('*')
    .eq('id', id)
    .single();

  if (errorFactura) {
    console.error('Error al obtener factura:', errorFactura);
    throw errorFactura;
  }

  // Obtener los detalles de esa factura
  const { data: detalles, error: errorDetalles } = await supabase
    .from('detallefactura')
    .select('*')
    .eq('factura_id', id);

  if (errorDetalles) {
    console.error('Error al obtener detalles de factura:', errorDetalles);
    throw errorDetalles;
  }

  // Obtener el cliente asociado
  let cliente = null;
  if (factura.cliente_id) {
    const { data: clienteData, error: errorCliente } = await supabase
      .from('clientes')
      .select('nombre, apellido, numero_documento')
      .eq('id', factura.cliente_id)
      .single();

    if (errorCliente) {
      console.warn('No se pudo obtener el cliente:', errorCliente);
    } else {
      cliente = clienteData;
    }
  }

  
  return { ...factura, cliente, detallefactura: detalles || [] };
}



export async function createFactura(factura: FacturaInsert) {
  const { data, error } = await supabase
    .from('factura')
    .insert([factura])
    .select()
    .single();

  if (error) {
    console.error('Error al crear factura:', error);
    throw error;
  }

  return data as Factura;
}

export async function updateFactura(id: number, factura: FacturaUpdate) {
  const { data, error } = await supabase
    .from('factura')
    .update(factura)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error al actualizar factura:', error);
    throw error;
  }

  return data as Factura;
}

export async function deleteFactura(id: number) {
  // Soft delete (estado inactivo)
  const { error } = await supabase
    .from('factura')
    .update({ estado_id: ESTADO_INACTIVO })
    .eq('id', id);

  if (error) {
    console.error('Error al inactivar factura:', error);
    throw error;
  }

  return true;
}


// Interfaz para los items del carrito
interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// Interfaz para los datos de entrada
interface GuardarFacturaInput {
  cliente_id: number;
  pedido_id: number;
  cartItems: CartItem[];
  metodo_pago_id?: number; // 
  iva_id?: number;         // 
}



export async function guardarFacturaCompleta(datos: GuardarFacturaInput) {
  const {
    cliente_id,
    pedido_id,
    cartItems,
    metodo_pago_id = 1,
    iva_id = 1
  } = datos;

  try {
    // 1️⃣ Calcular subtotal, IVA y total
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const ivaPorcentaje = 0.15; // Ajusta si tu IVA cambia
    const montoIva = subtotal * ivaPorcentaje;
    const total = subtotal + montoIva;

    console.log("Calculando factura:", { subtotal, montoIva, total });

    // 2️⃣ Crear factura
    const nuevaFactura: FacturaInsert = {
      cliente_id,
      pedido_id,
      fecha: new Date().toISOString(),
      iva_id,
      total,
      metodo_pago_id,
      estado_id: ESTADO_ACTIVO
    };

    const { data: facturaCreada, error: errorFactura } = await supabase
      .from("factura")
      .insert([nuevaFactura])
      .select()
      .single();

    if (errorFactura) {
      console.error("Error al crear factura:", errorFactura);
      throw new Error(`Error al crear factura: ${errorFactura.message}`);
    }

    if (!facturaCreada) {
      throw new Error("No se pudo crear la factura");
    }

    const facturaId = facturaCreada.id;
    console.log("✅ Factura creada con ID:", facturaId);

    // 3️⃣ Crear detalles de factura
    const detallesCreados = [];

    for (const item of cartItems) {
      const detalleFactura = {
        factura_id: facturaId,
        cantidad: item.quantity,
        precio: item.price,
        producto_nombre: item.name,
        subtotal: item.price * item.quantity
      };

      try {
        const detalleCreado = await createDetalleFactura(detalleFactura);
        detallesCreados.push(detalleCreado);
        console.log(`✅ Detalle creado para producto ${item.id}`);
      } catch (error) {
        console.error(`❌ Error al crear detalle para producto ${item.id}:`, error);
      }
    }

    console.log(
      `✅ Factura completa guardada: ${detallesCreados.length} detalles creados`
    );

    // 4️⃣ Retornar resumen
    return {
      factura: facturaCreada as Factura,
      detalles: detallesCreados,
      resumen: {
        subtotal,
        iva: montoIva,
        total,
        cantidadProductos: cartItems.length,
        cantidadItems: cartItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        )
      }
    };

  } catch (error) {
    console.error("❌ Error general al guardar factura completa:", error);
    throw error;
  }
}