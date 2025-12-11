import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import { format } from "date-fns";
import { Button, Card, Badge } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { HiArrowLeft, HiClock } from "react-icons/hi";
import courtService from "../services/courtService";
import "react-calendar/dist/Calendar.css";
import "../components/CalendarCustom.css";

const TIME_SLOTS = [
  "09:00",
  "10:30",
  "12:00",
  "13:30",
  "15:00",
  "16:30",
  "18:00",
  "19:30",
  "21:00",
];

function BookingCourt() {
  const { courtId } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    const fetchCourt = async () => {
      try {
        // Esperar mínimo 800ms para que se vea el spinner suavemente
        const minLoadingTime = new Promise((resolve) =>
          setTimeout(resolve, 800)
        );

        const [data] = await Promise.all([
          courtService.getById(courtId),
          minLoadingTime,
        ]);

        setCourt(data);
      } catch (error) {
        console.error("Error cargando pista", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourt();
  }, [courtId]);

  const handleTimeClick = (time) => {
    if (selectedTime === time) {
      setSelectedTime(null);
    } else {
      setSelectedTime(time);
    }
  };

  // Spinner personalizado
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  if (!court)
    return (
      <div className="text-center py-20 text-gray-500">Pista no encontrada</div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Botón Volver */}
      <button
        onClick={() => navigate("/reservas")}
        className="flex items-center text-gray-500 hover:text-primary-600 mb-6 font-medium transition-colors"
      >
        <HiArrowLeft className="mr-2" /> Volver a pistas
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna izquierda */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="dark:bg-gray-800 border-none shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {court.name}
            </h2>
            <div className="flex gap-2">
              <Badge color="gray">{court.surface}</Badge>
              <Badge color={court.type === "INDOOR" ? "purple" : "yellow"}>
                {court.type}
              </Badge>
            </div>
            <p className="text-3xl font-bold text-primary-600">
              {court.price}€
            </p>
          </Card>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              Selecciona Fecha
            </h3>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              minDate={new Date()}
              locale={i18n.language}
              className="w-full border-none rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Columna derecha */}
        <div className="lg:col-span-2">
          <Card className="dark:bg-gray-800 h-full border-none shadow-lg">
            <div className="border-b pb-4 mb-4 border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Horarios para el {format(selectedDate, "dd/MM/yyyy")}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Selecciona una hora para continuar
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {TIME_SLOTS.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeClick(time)}
                  className={`
                    flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200
                    ${
                      selectedTime === time
                        ? "border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-white dark:border-primary-500 scale-105 shadow-md"
                        : "border-gray-200 hover:border-primary-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                    }
                  `}
                >
                  <HiClock
                    className={`w-6 h-6 mb-2 transition-opacity ${
                      selectedTime === time ? "opacity-100" : "opacity-50"
                    }`}
                  />
                  <span className="font-bold text-lg">{time}</span>
                </button>
              ))}
            </div>

            {/* Zona de confirmación */}
            {selectedTime && (
              <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-end items-center gap-4 animate-fade-in">
                <div className="text-right hidden sm:block">
                  <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Resumen de reserva
                  </p>
                  <p className="font-bold text-lg text-gray-900 dark:text-white">
                    {format(selectedDate, "dd/MM/yyyy")} a las{" "}
                    <span className="text-primary-600">{selectedTime}</span>
                  </p>
                </div>

                <Button
                  size="xl"
                  className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  onClick={() =>
                    alert(`¡Vamos a reservar para las ${selectedTime}!`)
                  }
                >
                  Confirmar Reserva
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default BookingCourt;
