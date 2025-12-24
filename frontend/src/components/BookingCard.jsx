import { Card, Badge, Button } from "flowbite-react";
import { HiCalendar, HiClock, HiLocationMarker, HiTrash } from "react-icons/hi";
import { useTranslation } from "react-i18next";

// Recibimos booking, type y la nueva prop onCancel
function BookingCard({ booking, type, onCancel }) {
  const { t, i18n } = useTranslation();

  // Formatear fecha para que se vea bonita (ej: Sábado, 12 Octubre)
  const formattedDate = new Date(booking.date).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-sm">
      <Card className="dark:bg-gray-800 shadow-lg border-l-4 border-l-primary-500 overflow-hidden relative">
        {/* Cabecera de la tarjeta */}
        <div className="flex justify-between items-start mb-2">
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <HiLocationMarker className="text-primary-600" />
            {t("my_bookings.court", { id: booking.court.name })}
          </h5>
          <Badge color={type === "upcoming" ? "success" : "gray"}>
            {type === "upcoming"
              ? t("my_bookings.status_confirmed")
              : t("my_bookings.status_finished")}
          </Badge>
        </div>

        {/* Detalles */}
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <HiCalendar className="w-5 h-5 text-gray-400" />
            <span className="capitalize">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <HiClock className="w-5 h-5 text-gray-400" />
            <span className="font-semibold text-lg">{booking.time}</span>
          </div>
        </div>

        {/* Botón de Cancelar (Solo si es upcoming y existe la función onCancel) */}
        {type === "upcoming" && onCancel && (
          <div className="mt-4 pt-4 border-t dark:border-gray-700">
            <Button
              color="failure"
              size="sm"
              className="w-full"
              onClick={onCancel}
            >
              <HiTrash className="mr-2 h-4 w-4" />
              {t("my_bookings.cancel_btn")}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

export default BookingCard;
