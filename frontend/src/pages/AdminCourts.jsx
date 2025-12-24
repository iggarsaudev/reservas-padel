import { useEffect, useState } from "react";
import { Button, Card } from "flowbite-react"; // Solo importamos lo básico
import { HiPencil, HiTrash, HiPlus, HiX } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import courtService from "../services/courtService";
import Swal from "sweetalert2";

function AdminCourts() {
  const { t } = useTranslation();

  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Estado del Formulario
  const [formData, setFormData] = useState({
    name: "",
    type: "OUTDOOR",
    surface: "CRISTAL",
    price: "",
  });

  const fetchCourts = async () => {
    try {
      const data = await courtService.getAll();
      setCourts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openModal = (court = null) => {
    if (court) {
      setIsEditing(true);
      setCurrentId(court.id);
      setFormData({
        name: court.name,
        type: court.type,
        surface: court.surface,
        price: court.price,
      });
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setFormData({
        name: "",
        type: "OUTDOOR",
        surface: "CRISTAL",
        price: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await courtService.update(currentId, formData);
        Swal.fire(
          "¡Hecho!",
          t("courts_admin.alerts.update_success"),
          "success"
        );
      } else {
        await courtService.create(formData);
        Swal.fire(
          "¡Hecho!",
          t("courts_admin.alerts.create_success"),
          "success"
        );
      }
      closeModal();
      fetchCourts();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Ocurrió un error al guardar", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: t("courts_admin.alerts.delete_confirm_title"),
      text: t("courts_admin.alerts.delete_confirm_text"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    });

    if (result.isConfirmed) {
      try {
        await courtService.remove(id);
        setCourts(courts.filter((c) => c.id !== id));
        Swal.fire(
          "Eliminado",
          t("courts_admin.alerts.delete_success"),
          "success"
        );
      } catch (error) {
        const msg = error.response?.data?.error || "Error al eliminar";
        Swal.fire("Error", msg, "error");
      }
    }
  };

  // Clases CSS para inputs (Estilo Flowbite manual)
  const inputClass =
    "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500";
  const labelClass =
    "block mb-2 text-sm font-medium text-gray-900 dark:text-white";

  if (loading)
    return <div className="text-center py-10">Cargando pistas...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("courts_admin.title")}
        </h1>
        <Button color="success" onClick={() => openModal(null)}>
          <HiPlus className="mr-2 h-5 w-5" />
          {t("courts_admin.btn_new")}
        </Button>
      </div>

      <Card className="dark:bg-gray-800 shadow-xl overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="py-3 px-6">{t("courts_admin.table.name")}</th>
                <th className="py-3 px-6">{t("courts_admin.table.type")}</th>
                <th className="py-3 px-6">{t("courts_admin.table.surface")}</th>
                <th className="py-3 px-6">{t("courts_admin.table.price")}</th>
                <th className="py-3 px-6">{t("courts_admin.table.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {courts.map((court) => (
                <tr
                  key={court.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <td className="py-4 px-6 font-bold text-gray-900 dark:text-white">
                    {court.name}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        court.type === "INDOOR"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {court.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">{court.surface}</td>
                  <td className="py-4 px-6 text-primary-600 font-bold">
                    {court.price}€
                  </td>
                  <td className="py-4 px-6 flex gap-2">
                    <Button
                      size="xs"
                      color="light"
                      onClick={() => openModal(court)}
                    >
                      <HiPencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="xs"
                      color="failure"
                      onClick={() => handleDelete(court.id)}
                    >
                      <HiTrash className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* --- MODAL MANUAL (HTML + Tailwind) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-2xl dark:bg-gray-800 transform transition-all scale-100">
            {/* Cabecera del Modal */}
            <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isEditing
                  ? t("courts_admin.modal.title_edit")
                  : t("courts_admin.modal.title_create")}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            {/* Cuerpo del Modal (Formulario) */}
            <div className="p-6 space-y-6">
              <form onSubmit={handleSave} className="space-y-4">
                {/* Nombre */}
                <div>
                  <label htmlFor="name" className={labelClass}>
                    {t("courts_admin.modal.name_label")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={inputClass}
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Tipo */}
                <div>
                  <label htmlFor="type" className={labelClass}>
                    {t("courts_admin.modal.type_label")}
                  </label>
                  <select
                    id="type"
                    name="type"
                    className={inputClass}
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="OUTDOOR">OUTDOOR (Exterior)</option>
                    <option value="INDOOR">INDOOR (Cubierta)</option>
                  </select>
                </div>

                {/* Superficie */}
                <div>
                  <label htmlFor="surface" className={labelClass}>
                    {t("courts_admin.modal.surface_label")}
                  </label>
                  <select
                    id="surface"
                    name="surface"
                    className={inputClass}
                    value={formData.surface}
                    onChange={handleChange}
                  >
                    <option value="MURO">Muro</option>
                    <option value="CRISTAL">Cristal</option>
                  </select>
                </div>

                {/* Precio */}
                <div>
                  <label htmlFor="price" className={labelClass}>
                    {t("courts_admin.modal.price_label")}
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    step="0.5"
                    className={inputClass}
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Botones de Acción */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t dark:border-gray-600">
                  <Button color="gray" onClick={closeModal}>
                    {t("courts_admin.modal.btn_cancel")}
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 text-white"
                  >
                    {t("courts_admin.modal.btn_save")}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCourts;
