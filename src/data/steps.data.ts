import { MapPin, UtensilsCrossed, Bike, CheckCircle } from "lucide-react";

export const steps = [
  {
    icon: MapPin,
    title: "Elige tu ubicación",
    description: "Selecciona tu dirección de entrega",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    icon: UtensilsCrossed,
    title: "Ordena tu comida",
    description: "Explora menús y elige tus platos favoritos",
    color: "text-primary",
    bgColor: "bg-orange-100",
  },
  {
    icon: Bike,
    title: "Entrega rápida",
    description: "Recibe tu pedido en minutos",
    color: "text-secondary",
    bgColor: "bg-green-100",
  },
  {
    icon: CheckCircle,
    title: "¡Disfruta!",
    description: "Saborea comida deliciosa y caliente",
    color: "text-accent",
    bgColor: "bg-yellow-100",
  },
];