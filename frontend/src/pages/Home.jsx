import { Link } from "react-router-dom";
import { Button } from "flowbite-react";
import { HiCalendar, HiCreditCard, HiUserGroup } from "react-icons/hi";
import heroImage from "../assets/images/hero-padel.jpg";

function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION (Portada) */}
      <section className="relative bg-gray-900 text-white py-32 px-6">
        {/* Imagen de fondo con oscurecimiento (overlay) */}
        <div
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>

        {/* Contenido Hero */}
        <div className="relative z-10 container mx-auto text-center flex flex-col items-center gap-6">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            Juega al mejor <span className="text-primary-400">Pádel</span> de la
            ciudad
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Reserva tu pista en segundos. Sin llamadas, sin esperas. Gestiona
            tus partidos y compite con amigos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Link to="/reservas">
              <Button
                size="xl"
                className="bg-primary-600 hover:bg-primary-700 text-white border-2 border-transparent font-bold shadow-lg transform hover:scale-105 transition-transform w-full sm:w-auto px-8 py-3"
              >
                Reservar Ahora
              </Button>
            </Link>

            <Link to="/register">
              <Button
                size="xl"
                className="bg-transparent border-2 border-white text-white hover:bg-white/20 font-bold shadow-lg transform hover:scale-105 transition-transform w-full sm:w-auto px-8 py-3"
              >
                Crear Cuenta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION (Ventajas) */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            ¿Por qué elegir Padel App?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center border border-gray-100">
              <div className="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                <HiCalendar />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Reserva 24/7
              </h3>
              <p className="text-gray-600">
                Accede a la disponibilidad en tiempo real. Reserva tu pista
                favorita en cualquier momento del día.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center border border-gray-100">
              <div className="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                <HiUserGroup />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Organiza Partidos
              </h3>
              <p className="text-gray-600">
                Invita a tus amigos o encuentra rivales de tu nivel. Gestionamos
                la pista por ti.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center border border-gray-100">
              <div className="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                <HiCreditCard />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                Pago Seguro
              </h3>
              <p className="text-gray-600">
                Olvídate del efectivo. Paga online de forma segura y recibe tu
                confirmación al instante.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
