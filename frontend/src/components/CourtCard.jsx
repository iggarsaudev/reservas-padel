import { Link } from "react-router-dom";
import { Card, Badge, Button } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { HiCheck, HiSun, HiHome } from "react-icons/hi";
import defaultCourt from "../assets/images/default-court-padel.jpg";

function CourtCard({ court }) {
  const { t } = useTranslation();

  // Elegir icono según si es Indoor o Outdoor
  const TypeIcon = court.type === "INDOOR" ? HiHome : HiSun;
  const typeLabel =
    court.type === "INDOOR" ? "bookings.indoor" : "bookings.outdoor";
  const typeColor = court.type === "INDOOR" ? "purple" : "yellow";

  return (
    <Card
      className="max-w-sm hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      renderImage={() => (
        <img
          src={defaultCourt}
          alt={court.name}
          className="h-48 w-full object-cover rounded-t-lg"
        />
      )}
    >
      <div className="flex flex-col gap-3">
        {/* Título y Badge */}
        <div className="flex justify-between items-start">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {court.name}
          </h5>
          <Badge color={typeColor} icon={TypeIcon}>
            {t(typeLabel)}
          </Badge>
        </div>

        {/* Precio */}
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {court.price}€{" "}
          <span className="text-sm font-normal text-gray-500">/h</span>
        </p>

        {/* Características (Lista simple) */}
        <ul className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
          <li className="flex items-center gap-2">
            <HiCheck className="text-primary-600" />
            {t("bookings.surface")}: {court.surface}
          </li>
        </ul>

        {/* Botón de Acción */}
        <Link to={`/reservas/${court.id}`} className="w-full">
          <Button className="w-full mt-4 bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700">
            {t("bookings.book_btn")}
          </Button>
        </Link>
      </div>
    </Card>
  );
}

export default CourtCard;
