import { Link } from "react-router-dom";
import { Button } from "flowbite-react";
import { HiCalendar, HiCreditCard, HiUserGroup } from "react-icons/hi";
import heroImage from "../assets/images/hero-padel.jpg";
import { useTranslation } from "react-i18next";

function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900">
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
            {t("home.hero_title")}{" "}
            <span className="text-primary-400">Pádel</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            {t("home.hero_subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Link to="/reservas">
              <Button
                size="xl"
                className="bg-primary-600 hover:bg-primary-700 text-white border-2 border-transparent font-bold shadow-lg transform hover:scale-105 transition-transform w-full sm:w-auto px-8 py-3"
              >
                {t("home.cta_reserve")}
              </Button>
            </Link>

            <Link to="/register">
              <Button
                size="xl"
                className="bg-transparent border-2 border-white text-white hover:bg-white/20 font-bold shadow-lg transform hover:scale-105 transition-transform w-full sm:w-auto px-8 py-3"
              >
                {t("home.cta_account")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION (Ventajas) */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            {t("home.features_title")}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center border border-gray-100">
              <div className="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                <HiCalendar />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                {t("home.feature_1_title")}
              </h3>
              <p className="text-gray-600">{t("home.feature_1_desc")}</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center border border-gray-100">
              <div className="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                <HiUserGroup />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                {t("home.feature_2_title")}
              </h3>
              <p className="text-gray-600">{t("home.feature_2_desc")}</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center border border-gray-100">
              <div className="bg-primary-100 text-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                <HiCreditCard />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                {t("home.feature_3_title")}
              </h3>
              <p className="text-gray-600">{t("home.feature_3_desc")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
