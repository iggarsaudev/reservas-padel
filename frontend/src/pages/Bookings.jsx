import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Spinner, Alert } from "flowbite-react";
import courtService from "../services/courtService";
import CourtCard from "../components/CourtCard";
import { HiInformationCircle } from "react-icons/hi";

function Bookings() {
  const { t } = useTranslation();
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función para cargar datos
    const fetchCourts = async () => {
      try {
        const data = await courtService.getAll();
        setCourts(data);
      } catch (err) {
        console.error("Error fetching courts:", err);
        setError(t("bookings.error_loading"));
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, [t]);

  // ESTADO: CARGANDO
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Spinner size="xl" color="success" aria-label="Cargando" />
        <p className="text-gray-500 dark:text-gray-400">
          {t("bookings.loading")}
        </p>
      </div>
    );
  }

  // ESTADO: ERROR
  if (error) {
    return (
      <div className="container mx-auto mt-10 px-4">
        <Alert color="failure" icon={HiInformationCircle}>
          <span className="font-medium">Error!</span> {error}
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* CABECERA */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
          {t("bookings.title")}
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          {t("bookings.subtitle")}
        </p>
      </div>

      {/* LISTADO DE PISTAS (GRID) */}
      {courts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {courts.map((court) => (
            <CourtCard key={court.id} court={court} />
          ))}
        </div>
      ) : (
        // ESTADO: NO HAY PISTAS
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400 text-xl">
            {t("bookings.no_courts")}
          </p>
        </div>
      )}
    </div>
  );
}

export default Bookings;
