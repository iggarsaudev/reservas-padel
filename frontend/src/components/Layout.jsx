import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "flowbite-react";

function Layout() {
  const path = useLocation().pathname;

  // Clases para los enlaces (activo vs inactivo)
  const linkClass = (isActive) =>
    isActive
      ? "block py-2 pr-4 pl-3 text-white bg-primary-700 rounded md:bg-transparent md:text-primary-700 md:p-0 font-bold"
      : "block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-primary-700 md:p-0";

  return (
    <div className="flex flex-col min-h-screen">
      {/* NAVBAR  */}
      <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded border-b">
        <div className="container flex flex-wrap justify-between items-center mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap text-primary-600">
              🎾 Padel App
            </span>
          </Link>

          {/* Botones Derecha */}
          <div className="flex md:order-2 gap-2">
            <Link to="/login">
              <Button color="gray" size="xs">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button color="success" size="xs">
                Registro
              </Button>
            </Link>
          </div>

          {/* Menú Central */}
          <div className="hidden justify-between items-center w-full md:flex md:w-auto md:order-1">
            <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 font-medium">
              <li>
                <Link to="/" className={linkClass(path === "/")}>
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/reservas"
                  className={linkClass(path === "/reservas")}
                >
                  Reservar Pista
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* CONTENIDO */}
      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="p-4 bg-white rounded-lg shadow md:px-6 md:py-8 border-t">
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="self-center text-xl font-semibold whitespace-nowrap text-gray-500">
            Padel App™
          </span>
          <ul className="flex flex-wrap items-center mb-6 text-sm text-gray-500 sm:mb-0">
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">
                Sobre Nosotros
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contacto
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center">
          © 2025 Padel App. Todos los derechos reservados.
        </span>
      </footer>
    </div>
  );
}

export default Layout;
