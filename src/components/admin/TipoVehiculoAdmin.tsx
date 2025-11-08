import React from "react";
import SimpleTableAdmin from "@components/admin/SimpleTableAdmin";
import {
  fetchTipoVehiculos,
  createTipoVehiculo,
  updateTipoVehiculo,
  deleteTipoVehiculo,
} from "@services/tipoVehiculo";
import { fetchEstadosGenerales } from "@services/estadosGenerales";
import type { Database } from "@models/supabase";

type TipoVehiculo = Database["public"]["Tables"]["tipovehiculo"]["Row"];
type TipoVehiculoInsert =
  Database["public"]["Tables"]["tipovehiculo"]["Insert"];
type TipoVehiculoUpdate =
  Database["public"]["Tables"]["tipovehiculo"]["Update"];

const TipoVehiculoAdmin: React.FC = () => {
  return (
    <SimpleTableAdmin<TipoVehiculo, TipoVehiculoInsert, TipoVehiculoUpdate>
      title="Tipos de Vehículo"
      description="Gestiona los tipos de vehículo disponibles para los repartidores"
      buttonLabel="Nuevo Tipo de Vehículo"
      fields={[
        {
          name: "descripcion",
          label: "Descripción",
          type: "text",
          placeholder: "Ej: Motocicleta, Bicicleta, Automóvil",
          required: true,
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
        { key: "descripcion", label: "Descripción" },
        {
          key: "estado_id",
          label: "Estado",
          render: (
            _value,
            item: TipoVehiculo & {
              estados_generales?: { descripcion: string };
            },
          ) => {
            const estado = item.estados_generales;
            return (
              <span className="cursor-pointer">
                {estado ? estado.descripcion : "Sin estado"}
              </span>
            );
          },
          exportRender: (
            _value,
            item: TipoVehiculo & {
              estados_generales?: { descripcion: string };
            },
          ) => {
            const estado = item.estados_generales;
            return estado ? estado.descripcion : "Sin estado";
          },
        },
      ]}
      searchFields={["descripcion"]}
      operations={{
        fetch: fetchTipoVehiculos,
        create: createTipoVehiculo,
        update: updateTipoVehiculo,
        delete: deleteTipoVehiculo,
      }}
      getFormData={(formValues) => ({
        descripcion: formValues.descripcion,
        estado_id: parseInt(formValues.estado_id) || null,
      })}
      getInitialFormData={(item) => ({
        descripcion: item?.descripcion || "",
        estado_id: item?.estado_id?.toString() || "",
      })}
      enableExport={true}
      exportFilename="tipos_vehiculo"
    />
  );
};

export default TipoVehiculoAdmin;
