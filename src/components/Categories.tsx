import React, { useEffect, useState } from 'react';
import { Pizza, Beef, Cake, Coffee, Salad, Soup, IceCream, UtensilsCrossed } from 'lucide-react';
import { fetchCategoriasActivas } from '@services/categoriasProducto';
import { useNavigate } from 'react-router-dom';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mapeo de iconos por nombre de categoría
  const iconMap: Record<string, any> = {
    pizza: Pizza,
    pizzas: Pizza,
    hamburguesa: Beef,
    hamburguesas: Beef,
    postres: Cake,
    postre: Cake,
    bebidas: Coffee,
    bebida: Coffee,
    ensalada: Salad,
    ensaladas: Salad,
    sopas: Soup,
    sopa: Soup,
    helado: IceCream,
    helados: IceCream,
    'comida saludable': Salad,
    'comida rápida': Beef,
    'comida rapida': Beef,
    snacks: IceCream,
    snack: IceCream,
  };

  const getIcon = (nombre: string) => {
    const key = nombre.toLowerCase();
    return iconMap[key] || UtensilsCrossed;
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await fetchCategoriasActivas();
      setCategories(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoriaId: number) => {
    navigate(`/categoria/${categoriaId}`);
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-text-dark mb-12">
            Nuestras Categorías
          </h2>
          <div className="text-center text-gray-500">Cargando categorías...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white" data-section="categories">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-text-dark mb-12">
          Nuestras Categorías
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = getIcon(category.nombre);
            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="bg-gray-200 p-8 rounded-2xl shadow-lg hover:scale-105 transition-all ease-in-out duration-300 cursor-pointer"
              >
                <div className="flex flex-col items-center gap-4">
                  <IconComponent className="w-16 h-16 text-primary" />
                  <h3 className="text-xl font-semibold text-text-dark">
                    {category.nombre}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
