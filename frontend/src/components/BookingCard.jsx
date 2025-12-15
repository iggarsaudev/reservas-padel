import { Card, Badge } from "flowbite-react";
import { format, parseISO } from "date-fns";
import { HiCalendar, HiClock, HiLocationMarker } from "react-icons/hi";

function BookingCard({ booking, type }) {
  // Convertimos la fecha string a objeto fecha
  const dateObj = parseISO(booking.date);

  return (
    <Card
      className={`border-none shadow-md ${
        type === "upcoming"
          ? "ring-2 ring-primary-100 dark:ring-primary-900"
          : ""
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            {booking.court.name}
          </h5>
          <span className="text-xs text-gray-500">{booking.court.surface}</span>
        </div>
        <Badge color={type === "upcoming" ? "success" : "gray"}>
          {type === "upcoming" ? "ACTIVA" : "FINALIZADA"}
        </Badge>
      </div>

      <div className="space-y-3 mt-2">
        <div className="flex items-center text-gray-700 dark:text-gray-300">
          <HiCalendar className="mr-2 h-5 w-5 text-gray-400" />
          <span className="font-medium">{format(dateObj, "dd/MM/yyyy")}</span>
        </div>
        <div className="flex items-center text-gray-700 dark:text-gray-300">
          <HiClock className="mr-2 h-5 w-5 text-gray-400" />
          <span className="font-medium text-xl">{booking.time}</span>
        </div>
        <div className="flex items-center text-gray-700 dark:text-gray-300">
          <HiLocationMarker className="mr-2 h-5 w-5 text-gray-400" />
          <span>{booking.court.type}</span>
        </div>
      </div>
    </Card>
  );
}

export default BookingCard;
