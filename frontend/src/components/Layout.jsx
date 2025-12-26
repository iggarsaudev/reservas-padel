import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  HiGlobeAlt,
  HiMenu,
  HiX,
  HiMoon,
  HiSun,
  HiLogout,
  HiShieldCheck,
  HiUser,
} from "react-icons/hi";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

function Layout() {
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getAvatarPath = (filename) => {
    if (!filename) return "/avatars/default_avatar.png";
    if (filename.startsWith("http")) return filename;
    return `/avatars/${filename}`;
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const currentLabel = i18n.language?.startsWith("en") ? "EN" : "ES";

  const getLinkClass = (route) => {
    const isActive = path === route;
    const base =
      "block py-2 pr-4 pl-3 rounded md:p-0 transition-colors duration-200 border-b border-gray-100 md:border-0 font-medium";

    if (isActive) {
      return `${base} bg-primary-600 text-white md:bg-transparent md:text-primary-500 dark:text-white md:dark:text-primary-500`;
    } else {
      return `${base} text-gray-700 dark:text-gray-400 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-primary-600 md:dark:hover:text-white`;
    }
  };

  const headerButtonClass =
    "text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500 focus:outline-none focus:ring-0 rounded-lg text-sm p-2.5 transition-colors duration-200 flex items-center gap-1";

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900">
      <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded border-b dark:bg-gray-800 dark:border-gray-700 relative z-50">
        <div className="container flex flex-wrap justify-between items-center mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/mi-logo-padel.png"
              className="h-10 w-auto"
              alt="Logo Padel App"
            />

            <span className="self-center whitespace-nowrap text-xl font-semibold text-primary-600 dark:text-white">
              Padel App
            </span>
          </Link>

          <div className="flex items-center md:order-2 gap-1">
            {isAuthenticated ? (
              // --- MENÚ ESCRITORIO LOGUEADO (Visible solo en MD o superior) ---
              <div className="hidden md:flex items-center gap-4 mr-4 border-r border-gray-200 dark:border-gray-700 pr-4">
                {/* ENLACE ADMIN ESCRITORIO */}
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1 font-bold text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    <HiShieldCheck className="w-4 h-4" />
                    {t("navbar.admin_panel")}
                  </Link>
                )}

                <Link
                  to="/mis-reservas"
                  className="hover:text-primary-600 dark:hover:text-primary-500 transition-colors"
                >
                  {t("navbar.my_bookings")}
                </Link>

                <Link
                  to="/perfil"
                  className="hover:text-primary-600 dark:hover:text-primary-500 transition-colors flex items-center gap-1"
                  title="Mi Perfil"
                >
                  <HiUser className="w-5 h-5" />
                  <span>{t("navbar.my_profile")}</span>
                </Link>

                {/* Nombre de usuario */}
                <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {user?.avatar && (
                    <img
                      src={getAvatarPath(user?.avatar)}
                      alt="Avatar"
                      className="w-5 h-5 rounded-full"
                    />
                  )}
                  <span>{t("navbar.welcome_user", { name: user?.name })}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 transition-colors"
                  title={t("navbar.logout")}
                >
                  <HiLogout className="w-5 h-5" />
                </button>
              </div>
            ) : (
              // --- MENÚ ESCRITORIO NO LOGUEADO ---
              <div className="hidden md:flex gap-4 mr-2 items-center border-r border-gray-200 dark:border-gray-700 pr-4">
                <Link to="/login" className={getLinkClass("/login")}>
                  {t("navbar.login")}
                </Link>
                <Link to="/register" className={getLinkClass("/register")}>
                  {t("navbar.register")}
                </Link>
              </div>
            )}

            {/* Tema / Idioma */}
            <button onClick={toggleTheme} className={headerButtonClass}>
              {theme === "dark" ? (
                <HiMoon className="w-6 h-6" />
              ) : (
                <HiSun className="w-6 h-6" />
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`min-w-[4.5rem] justify-center ${headerButtonClass}`}
                type="button"
              >
                <HiGlobeAlt className="w-5 h-5" />
                <span>{currentLabel}</span>
              </button>

              {isDropdownOpen && (
                <div className="z-50 absolute right-0 mt-2 w-32 bg-white divide-y divide-gray-100 rounded shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-700">
                  <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                    <li>
                      <button
                        onClick={() => changeLanguage("es")}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-primary-600 dark:hover:text-primary-500"
                      >
                        Español
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => changeLanguage("en")}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-primary-600 dark:hover:text-primary-500"
                      >
                        English
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Botón hamburguesa móvil */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-0 dark:text-gray-400 dark:hover:bg-gray-700 ml-1"
            >
              {isMobileMenuOpen ? (
                <HiX className="w-6 h-6" />
              ) : (
                <HiMenu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Menú móvil y Lista principal */}
          <div
            className={`${
              isMobileMenuOpen ? "block" : "hidden"
            } justify-between items-center w-full md:flex md:w-auto md:order-1`}
          >
            <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 font-medium bg-gray-50 md:bg-white dark:bg-gray-800 md:dark:bg-transparent rounded-lg p-4 md:p-0 border border-gray-100 md:border-0 dark:border-gray-700">
              <li>
                <Link
                  to="/"
                  className={getLinkClass("/")}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("navbar.home")}
                </Link>
              </li>
              <li>
                <Link
                  to="/reservas"
                  className={getLinkClass("/reservas")}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("navbar.book")}
                </Link>
              </li>

              {/* ENLACE ADMIN MÓVIL */}
              {user?.role === "admin" && (
                <li className="md:hidden">
                  <Link
                    to="/admin"
                    className={`${getLinkClass(
                      "/admin"
                    )} text-red-600 dark:text-red-500 font-bold`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("navbar.admin_panel")}
                  </Link>
                </li>
              )}

              {/* Bloque de usuario móvil */}
              <li className="mt-4 md:hidden border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 px-3 text-sm">
                      {user?.avatar && (
                        <img
                          src={getAvatarPath(user?.avatar)}
                          alt="Avatar"
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <span>Hola, {user?.name}</span>
                    </div>

                    {/* ENLACE PERFIL MÓVIL */}
                    <Link
                      to="/perfil"
                      className="block py-2 pr-4 pl-3 text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Mi Perfil
                    </Link>

                    <Link
                      to="/mis-reservas"
                      className="block py-2 pr-4 pl-3 text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t("navbar.my_bookings")}
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left py-2 pr-4 pl-3 rounded text-red-500 font-bold hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {t("navbar.logout")}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={getLinkClass("/login")}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t("navbar.login")}
                    </Link>
                    <Link
                      to="/register"
                      className={getLinkClass("/register")}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t("navbar.register")}
                    </Link>
                  </>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>

      <footer className="p-4 bg-white rounded-lg shadow md:px-6 md:py-8 border-t dark:bg-gray-800 dark:border-gray-700">
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="self-center text-xl font-semibold whitespace-nowrap text-gray-500 dark:text-gray-400">
            Padel App™
          </span>
          <ul className="flex flex-wrap items-center mb-6 text-sm text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">
                {t("footer.about")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                {t("footer.contact")}
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8 dark:border-gray-700" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2025 Padel App. {t("footer.rights")}
        </span>
      </footer>
    </div>
  );
}

export default Layout;
