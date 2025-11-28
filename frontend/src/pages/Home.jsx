import { Button } from "flowbite-react";
import { HiArrowRight } from "react-icons/hi"; // Icono de ejemplo

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-6">
      <h1 className="text-4xl font-extrabold text-gray-900">
        Bienvenido a <span className="text-primary-600">Padel App</span>
      </h1>

      {/* Botón usando nuestro color 'primary' configurado en tailwind */}
      <Button color="success" size="xl">
        Reservar Pista
        <HiArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
}

export default Home;
