import { useEffect, useState } from "react";
import { Badge, Button, Card } from "flowbite-react";
import { HiTrash, HiUser } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import bookingService from "../services/bookingService";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getAll();
      setBookings(data);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", t("admin.alerts.load_error"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: t("admin.alerts.delete_title"),
      text: t("admin.alerts.delete_text"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("admin.alerts.delete_confirm"),
      cancelButtonText: t("admin.alerts.delete_cancel"),
    });

    if (result.isConfirmed) {
      try {
        await bookingService.deleteBooking(id);
        setBookings(bookings.filter((b) => b.id !== id));

        Swal.fire(
          t("admin.alerts.success_title"),
          t("admin.alerts.success_text"),
          "success"
        );
      } catch (error) {
        Swal.fire(
          t("admin.alerts.error_title"),
          t("admin.alerts.error_text"),
          "error"
        );
      }
    }
  };

  if (loading)
    return (
      <div className="text-center py-10 text-gray-500">
        {t("admin.loading")}
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("admin.title")}
        </h1>

        <Link to="/admin/pistas">
          <Button className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white">
            {t("admin.manage_courts")} 🎾
          </Button>
        </Link>
      </div>

      <Card className="dark:bg-gray-800 shadow-xl overflow-hidden p-0">
        <div className="overflow-x-auto relative">
          {/* TABLA HTML ESTÁNDAR CON CLASES FLOWBITE */}
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="py-3 px-6">
                  {t("admin.table.id")}
                </th>
                <th scope="col" className="py-3 px-6">
                  {t("admin.table.user")}
                </th>
                <th scope="col" className="py-3 px-6">
                  {t("admin.table.court")}
                </th>
                <th scope="col" className="py-3 px-6">
                  {t("admin.table.date")}
                </th>
                <th scope="col" className="py-3 px-6">
                  {t("admin.table.time")}
                </th>
                <th scope="col" className="py-3 px-6">
                  {t("admin.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    #{booking.id}
                  </td>

                  {/* Usuario */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-full">
                        <HiUser className="text-gray-500 dark:text-gray-300 w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {booking.user?.name} {booking.user?.surnames}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {booking.user?.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Pista */}
                  <td className="py-4 px-6">
                    <Badge color="info" className="inline-flex">
                      {booking.court?.name}
                    </Badge>
                  </td>

                  {/* Fecha */}
                  <td className="py-4 px-6">
                    {format(new Date(booking.date), "dd/MM/yyyy")}
                  </td>

                  {/* Hora */}
                  <td className="py-4 px-6">
                    <Badge color="gray" className="inline-flex">
                      {booking.time}
                    </Badge>
                  </td>

                  {/* Botones */}
                  <td className="py-4 px-6">
                    <Button
                      size="xs"
                      color="failure"
                      onClick={() => handleDelete(booking.id)}
                    >
                      <HiTrash className="mr-1 h-4 w-4" />{" "}
                      {t("admin.table.delete_btn")}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {bookings.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-t dark:border-gray-700">
              {t("admin.no_bookings")}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default AdminDashboard;
