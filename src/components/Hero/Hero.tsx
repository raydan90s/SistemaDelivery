import { Button } from "@components/ui/button";
import { ArrowRight, Clock, Bike, Star } from "lucide-react";
import heroImage from "@assets/hero-food.jpg";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Delicious food spread"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white">
            <Star className="h-4 w-4 fill-current" />
            <span>Delivery en 30 minutos o menos</span>
          </div>

          <h1 className="mb-6 text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Tu comida favorita,
            <span className="block text-accent">a un click</span>
          </h1>

          <p className="mb-8 text-lg md:text-xl text-white/90 max-w-xl">
            Ordena de los mejores restaurantes de tu ciudad. Entrega rápida, comida caliente, 
            sabor garantizado.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button variant="hero" size="xl" className="group" asChild>
              <Link to="/menu">
                Ver Menú
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="delivery" size="xl" asChild>
              <Link to="/tracking">
                Rastrea tu Pedido
                <Bike className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">30 min</div>
                <div className="text-sm text-white/80">Entrega promedio</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Bike className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm text-white/80">Pedidos diarios</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Star className="h-6 w-6 text-white fill-current" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">4.8/5</div>
                <div className="text-sm text-white/80">Satisfacción</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
