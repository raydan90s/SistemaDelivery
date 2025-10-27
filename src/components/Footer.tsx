import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-footer text-white py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Sobre Nosotros</h3>
            <p className="text-gray-300">
              FoodExpress te trae la mejor comida directamente a tu puerta.
              Calidad, rapidez y sabor garantizado.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>+34 123 456 789</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                <span>info@foodexpress.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>Calle Principal 123, Madrid</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Síguenos</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="bg-primary hover:bg-primary-hover p-3 rounded-full transition-all ease-in-out duration-300 hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-primary hover:bg-primary-hover p-3 rounded-full transition-all ease-in-out duration-300 hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-primary hover:bg-primary-hover p-3 rounded-full transition-all ease-in-out duration-300 hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-footer-text">
          <p>&copy; 2025 FoodExpress. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
