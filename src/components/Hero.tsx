import React from "react";
import HeroImg from "@assets/Hero.jpeg";

const Hero: React.FC = () => {
  return (
    <section className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
      {/* Imagen de fondo */}
      <img
        src={HeroImg}
        alt="Hero background"
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      />

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Contenido */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          Deliciosa comida a tu puerta
        </h1>
        <p className="text-lg md:text-xl mb-8 drop-shadow-md">
          Los mejores platillos, entregados rápido y caliente
        </p>
        <button className="bg-primary hover:bg-primary-hover cursor-pointer text-white font-semibold px-8 py-4 rounded-full text-lg shadow-lg transition-all ease-in-out duration-300 hover:scale-105">
          Ordena ahora
        </button>
      </div>
    </section>
  );
};

export default Hero;
