import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-footer text-white py-8 relative overflow-hidden mt-auto">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4">Sobre Nosotros</h3>
            <p className="text-gray-300">
              DeliciousExpress te trae la mejor comida directamente a tu puerta.
              Calidad, rapidez y sabor garantizado.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>+593 98 653 7897</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span className="break-all">info@deliciousexpress.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span>Cdla. Alborada 7ma Etapa Mz. 737 Sl. 6</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-footer-text">
          <p>&copy; 2025 DeliciousExpress. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
