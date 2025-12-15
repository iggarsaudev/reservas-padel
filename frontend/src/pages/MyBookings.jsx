import { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { isPast, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import { HiTicket } from "react-icons/hi";
import toast from "react-hot-toast";
import bookingService from "../services/bookingService";
import BookingCard from "../components/BookingCard";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingService.getUserBookings();
        setBookings(data);
      } catch (error) {
        console.error(error);
        toast.error("No se pudieron cargar tus reservas");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  // Filtrar
  const upcomingBookings = bookings.filter(
    (b) => !isPast(parseISO(b.date + "T" + b.time))
  );
  const pastBookings = bookings.filter((b) =>
    isPast(parseISO(b.date + "T" + b.time))
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white flex items-center gap-3">
        <HiTicket className="text-primary-600" />
        Mis Reservas
      </h1>

      {/* Sin partidos */}
      {bookings.length === 0 && (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <p className="text-xl text-gray-500 mb-6">
            Aún no has jugado ningún partido.
          </p>
          <Link to="/reservas">
            <Button size="xl" gradientDuoTone="greenToBlue">
              ¡Reserva tu primera pista!
            </Button>
          </Link>
        </div>
      )}

      {/* Próximos partidos */}
      {upcomingBookings.length > 0 && (
        <div className="mb-12 animate-fade-in-up">
          <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-300 border-b pb-2">
            Próximos Partidos 🎾
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} type="upcoming" />
            ))}
          </div>
        </div>
      )}

      {/* Historial */}
      {pastBookings.length > 0 && (
        <div className="animate-fade-in-up delay-100">
          <h2 className="text-xl font-bold mb-4 text-gray-500 dark:text-gray-400 border-b pb-2">
            Historial
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 opacity-75 grayscale hover:grayscale-0 transition-all">
            {pastBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} type="past" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBookings;
