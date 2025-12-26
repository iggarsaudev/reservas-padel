import { Link } from "react-router-dom";
import { Button, Card } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { HiCheck, HiUserGroup, HiLightningBolt } from "react-icons/hi";
import heroImage from "../assets/images/hero-padel.jpg";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { t } = useTranslation();
  const { user } = useAuth();

  // LÓGICA DE NOMBRE A PRUEBA DE FALLOS
  // 1. Si hay usuario y tiene nombre -> Usa el nombre
  // 2. Si hay usuario pero NO tiene nombre -> Usa lo que hay antes del @ en el email
  // 3. Si no hay usuario -> null
  const getUserDisplayName = () => {
    if (!user) return null;
    if (user.name) return user.name;
    if (user.email) return user.email.split("@")[0]; // Fallback al email
    return "Jugador"; // Fallback final por si acaso
  };

  const displayName = getUserDisplayName();

  return (
    <div className="min-h-screen flex flex-col">
      {/* --- HERO SECTION --- */}
      <section className="relative bg-gray-900 text-white py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Padel Court"
            className="w-full h-full object-cover opacity-40"
          />
        </div>

        <div className="relative z-10 container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 animate-fade-in-up">
            {/* Renderizado condicional seguro */}
            {displayName ? (
              <>
                <span className="block mb-2 text-primary-400">
                  ¡Hola, {displayName}!
                </span>
                {t("home.hero_title_1")}
              </>
            ) : (
              t("home.hero_title_1")
            )}
            <br />
            <span className="text-primary-500">{t("home.hero_title_2")}</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {t("home.hero_subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* BOTÓN 1: RESERVAR
                SOLUCIÓN: Hemos quitado 'gradientDuoTone'. 
                Usamos clases de Tailwind directas (bg-gradient-to-r...) para el mismo efecto. 
                Esto elimina el error de consola 100%. */}
            <Link to="/reservas">
              <Button
                size="xl"
                className="w-full sm:w-auto font-bold shadow-lg hover:scale-105 transition-transform bg-gradient-to-r from-green-400 to-blue-600 border-none hover:from-green-500 hover:to-blue-700 text-white focus:ring-4 focus:ring-blue-300"
              >
                {t("home.cta_reserve")}
              </Button>
            </Link>

            {/* BOTÓN 2: REGISTRO */}
            <Link to="/register">
              <Button
                size="xl"
                color="light"
                className="w-full sm:w-auto font-bold hover:scale-105 transition-transform"
              >
                {t("home.cta_register")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- CARACTERÍSTICAS (FEATURES) --- */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t("home.features_title")}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              {t("home.features_subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="dark:bg-gray-800 border-none shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-blue-100 rounded-full mb-4 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                  <HiLightningBolt className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {t("home.feature_1_title")}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {t("home.feature_1_desc")}
                </p>
              </div>
            </Card>

            <Card className="dark:bg-gray-800 border-none shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-green-100 rounded-full mb-4 text-green-600 dark:bg-green-900 dark:text-green-300">
                  <HiCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {t("home.feature_2_title")}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {t("home.feature_2_desc")}
                </p>
              </div>
            </Card>

            <Card className="dark:bg-gray-800 border-none shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-purple-100 rounded-full mb-4 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                  <HiUserGroup className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                  {t("home.feature_3_title")}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {t("home.feature_3_desc")}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            {t("home.final_title")}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            {t("home.final_text")}
          </p>

          {/* BOTÓN FINAL
              SOLUCIÓN: Quitamos 'gradientMonochrome'. Usamos bg-cyan-600 manualmente. */}
          <Link to="/register">
            <Button
              size="xl"
              className="font-bold bg-cyan-600 hover:bg-cyan-700 text-white border-none focus:ring-4 focus:ring-cyan-300"
            >
              {t("home.final_btn")}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
