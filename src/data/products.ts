import type { Product } from '@models/index';

export const products: Product[] = [
  {
    id: '1',
    name: 'Pizza Margherita',
    category: 'Pizzas',
    price: 12.99,
    image: 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Deliciosa pizza con tomate fresco y mozzarella'
  },
  {
    id: '2',
    name: 'Pizza Pepperoni',
    category: 'Pizzas',
    price: 14.99,
    image: 'https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Clásica pizza con pepperoni y queso'
  },
  {
    id: '3',
    name: 'Hamburguesa Clásica',
    category: 'Hamburguesas',
    price: 9.99,
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Hamburguesa jugosa con lechuga, tomate y cebolla'
  },
  {
    id: '4',
    name: 'Hamburguesa BBQ',
    category: 'Hamburguesas',
    price: 11.99,
    image: 'https://images.pexels.com/photos/1556698/pexels-photo-1556698.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Hamburguesa con salsa BBQ y bacon crujiente'
  },
  {
    id: '5',
    name: 'Cheesecake',
    category: 'Postres',
    price: 6.99,
    image: 'https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Suave cheesecake con frutos rojos'
  },
  {
    id: '6',
    name: 'Brownie de Chocolate',
    category: 'Postres',
    price: 5.99,
    image: 'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Brownie caliente con helado de vainilla'
  },
  {
    id: '7',
    name: 'Coca Cola',
    category: 'Bebidas',
    price: 2.99,
    image: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Refresco clásico 500ml'
  },
  {
    id: '8',
    name: 'Limonada Natural',
    category: 'Bebidas',
    price: 3.99,
    image: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Limonada recién exprimida'
  }
];
