import React from "react";
import SimpleTableAdmin from "@components/admin/SimpleTableAdmin";
import {
  fetchRepartidores,
  createRepartidor,
  updateRepartidor,
  deleteRepartidor,
} from "@services/repartidores";
import { fetchTipoVehiculosActivos } from "@services/tipoVehiculo";
import { fetchEstadosGenerales } from "@services/estadosGeneralesService";
import type { Database } from "@models/supabase";

type Repartidor = Database["public"]["Tables"]["repartidores"]["Row"];
type RepartidorInsert = Database["public"]["Tables"]["repartidores"]["Insert"];
type RepartidorUpdate = Database["public"]["Tables"]["repartidores"]["Update"];

type RepartidorExtended = Repartidor & {
  tipovehiculo?: { descripcion: string };
  estados_generales?: { descripcion: string };
};

const RepartidoresAdmin: React.FC = () => {
  return (
    <SimpleTableAdmin<Repartidor, RepartidorInsert, RepartidorUpdate>
      title="Repartidores"
      description="Gestiona el personal de reparto y sus vehículos asignados"
      buttonLabel="Nuevo Repartidor"
      fields={[
        {
          name: "nombre",
          label: "Nombre",
          type: "text",
          placeholder: "Ej: Juan Carlos",
          required: true,
        },
        {
          name: "apellido",
          label: "Apellido",
          type: "text",
          placeholder: "Ej: Pérez González",
          required: false,
        },
        {
          name: "telefono",
          label: "Teléfono",
          type: "text",
          placeholder: "Ej: 0987654321",
          required: false,
        },
        {
          name: "tipo_vehiculo_id",
          label: "Tipo de Vehículo",
          type: "select",
          placeholder: "Selecciona el tipo de vehículo",
          required: true,
          fetchOptions: fetchTipoVehiculosActivos,
        },
        {
          name: "estado_id",
          label: "Estado",
          type: "select",
          placeholder: "Selecciona el estado",
          required: true,
          fetchOptions: async () => {
            const estados = await fetchEstadosGenerales();
            return estados.map((estado) => ({
              value: estado.id,
              label: estado.descripcion,
            }));
          },
        },
      ]}
      columns={[
        { key: "id", label: "ID" },
        { key: "nombre", label: "Nombre" },
        { key: "apellido", label: "Apellido" },
        { key: "telefono", label: "Teléfono" },
        {
          key: "tipo_vehiculo_id",
          label: "Tipo de Vehículo",
          render: (_value, item: RepartidorExtended) => {
            const tipoVehiculo = item.tipovehiculo;
            return tipoVehiculo ? tipoVehiculo.descripcion : "Sin asignar";
          },
          exportRender: (_value, item: RepartidorExtended) => {
            const tipoVehiculo = item.tipovehiculo;
            return tipoVehiculo ? tipoVehiculo.descripcion : "Sin asignar";
          },
        },
        {
          key: "estado_id",
          label: "Estado",
          render: (_value, item: RepartidorExtended) => {
            const estado = item.estados_generales;
            if (!estado) return "Sin estado";

            const badgeColor =
              estado.descripcion === "Activo"
                ? "bg-green-100 text-green-800"
                : estado.descripcion === "Inactivo"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800";

            return (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor} cursor-pointer`}
              >
                {estado.descripcion}
              </span>
            );
          },
          exportRender: (_value, item: RepartidorExtended) => {
            const estado = item.estados_generales;
            return estado ? estado.descripcion : "Sin estado";
          },
        },
      ]}
      searchFields={["nombre", "apellido", "telefono"]}
      operations={{
        fetch: fetchRepartidores,
        create: createRepartidor,
        update: updateRepartidor,
        delete: deleteRepartidor,
      }}
      getFormData={(formValues) => ({
        nombre: formValues.nombre,
        apellido: formValues.apellido || null,
        telefono: formValues.telefono || null,
        tipo_vehiculo_id: parseInt(formValues.tipo_vehiculo_id) || null,
        estado_id: parseInt(formValues.estado_id) || null,
      })}
      getInitialFormData={(item) => ({
        nombre: item?.nombre || "",
        apellido: item?.apellido || "",
        telefono: item?.telefono || "",
        tipo_vehiculo_id: item?.tipo_vehiculo_id?.toString() || "",
        estado_id: item?.estado_id?.toString() || "",
      })}
      enableExport={true}
      exportFilename="repartidores"
    />
  );
};

export default RepartidoresAdmin;
