import { Card } from "@components/ui/card";
import { Pizza, Coffee, IceCream, Soup, Beef, Salad } from "lucide-react";

const categories = [
  { name: "Pizzas", icon: Pizza, color: "bg-orange-100 text-orange-600" },
  { name: "Bebidas", icon: Coffee, color: "bg-amber-100 text-amber-600" },
  { name: "Postres", icon: IceCream, color: "bg-pink-100 text-pink-600" },
  { name: "Sopas", icon: Soup, color: "bg-blue-100 text-blue-600" },
  { name: "Carnes", icon: Beef, color: "bg-red-100 text-red-600" },
  { name: "Ensaladas", icon: Salad, color: "bg-green-100 text-green-600" },
];

export const FeaturedCategories = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explora por Categoría
          </h2>
          <p className="text-muted-foreground text-lg">
            Encuentra exactamente lo que buscas
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Card
              key={category.name}
              className="p-6 text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-card group"
            >
              <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${category.color} transition-transform group-hover:rotate-12`}>
                <category.icon className="h-8 w-8" />
              </div>
              <h3 className="font-semibold">{category.name}</h3>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
