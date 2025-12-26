import { useEffect, useState } from "react";
import { Button, Card } from "flowbite-react";
import { useTranslation } from "react-i18next";
import userService from "../services/userService";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

// Lista de avatares seleccionables
const AVAILABLE_AVATARS = [
  "avatar1.png",
  "avatar2.png",
  "avatar3.png",
  "avatar4.png",
];

const DEFAULT_AVATAR_FILE = "default_avatar.png";

function Profile() {
  const { t } = useTranslation();
  const { updateUser } = useAuth();

  const [loading, setLoading] = useState(true);

  // Estado para Datos Personales
  const [userData, setUserData] = useState({
    name: "",
    surnames: "",
    email: "",
    avatar: "",
  });

  // Estado para Contraseña
  const [passData, setPassData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  // Helper para construir la ruta de la imagen
  const getAvatarPath = (filename) => {
    if (filename && filename.startsWith("http")) return filename;
    if (filename) return `/avatars/${filename}`;
    return `/avatars/${DEFAULT_AVATAR_FILE}`;
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await userService.getProfile();
        setUserData({
          name: data.name || "",
          surnames: data.surnames || "",
          email: data.email || "",
          avatar: data.avatar,
        });
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudo cargar el perfil", "error");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleUserChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handlePassChange = (e) => {
    setPassData({ ...passData, [e.target.name]: e.target.value });
  };

  const selectAvatar = (filename) => {
    setUserData({ ...userData, avatar: filename });
  };

  const submitData = async (e) => {
    e.preventDefault();
    try {
      // Enviamos al backend para que guarde en base de datos
      await userService.updateProfile({
        name: userData.name,
        surnames: userData.surnames,
        avatar: userData.avatar,
      });

      updateUser({
        name: userData.name,
        surnames: userData.surnames,
        avatar: userData.avatar,
      });

      Swal.fire("¡Genial!", t("profile.msg_update_success"), "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error al actualizar datos", "error");
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    try {
      await userService.changePassword(
        passData.currentPassword,
        passData.newPassword
      );
      Swal.fire("¡Hecho!", t("profile.msg_password_success"), "success");
      setPassData({ currentPassword: "", newPassword: "" });
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error || "Error al cambiar contraseña";
      Swal.fire("Error", msg, "error");
    }
  };

  const labelClass =
    "block mb-2 text-sm font-medium text-gray-900 dark:text-white";
  const inputClass =
    "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500";
  const disabledClass =
    "bg-gray-200 border border-gray-300 text-gray-500 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed";

  if (loading)
    return <div className="text-center py-10">Cargando perfil...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white text-center">
        {t("profile.title")}
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* TARJETA 1: DATOS PERSONALES + AVATAR */}
        <Card className="dark:bg-gray-800">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white border-b pb-2">
            {t("profile.personal_data")}
          </h2>

          <form onSubmit={submitData} className="space-y-6">
            {/* SECCIÓN DE AVATAR */}
            <div className="text-center">
              <label className={labelClass}>Elige tu Avatar</label>

              <div className="flex justify-center mb-4">
                <img
                  src={getAvatarPath(userData.avatar)}
                  alt="Avatar Actual"
                  className="w-24 h-24 rounded-full border-4 border-primary-500 shadow-lg bg-white object-cover"
                />
              </div>

              <div className="flex justify-center gap-4 mb-4 flex-wrap">
                {AVAILABLE_AVATARS.map((filename, index) => (
                  <img
                    key={index}
                    src={getAvatarPath(filename)}
                    alt={`Option ${index}`}
                    onClick={() => selectAvatar(filename)}
                    className={`w-12 h-12 rounded-full cursor-pointer hover:scale-110 transition-transform bg-white border border-gray-200 ${
                      userData.avatar === filename
                        ? "ring-4 ring-primary-500"
                        : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            <hr className="dark:border-gray-700" />

            <div>
              <label className={labelClass}>{t("profile.lbl_email")}</label>
              <input
                type="text"
                value={userData.email}
                className={disabledClass}
                disabled
              />
            </div>
            <div>
              <label htmlFor="name" className={labelClass}>
                {t("profile.lbl_name")}
              </label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleUserChange}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="surnames" className={labelClass}>
                {t("profile.lbl_surnames")}
              </label>
              <input
                type="text"
                name="surnames"
                value={userData.surnames}
                onChange={handleUserChange}
                className={inputClass}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              {t("profile.btn_update_data")}
            </button>
          </form>
        </Card>

        {/* TARJETA 2: SEGURIDAD (PASSWORD) */}
        <Card className="dark:bg-gray-800 h-fit">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white border-b pb-2">
            {t("profile.security")}
          </h2>
          <form onSubmit={submitPassword} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className={labelClass}>
                {t("profile.lbl_current_password")}
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passData.currentPassword}
                onChange={handlePassChange}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword" className={labelClass}>
                {t("profile.lbl_new_password")}
              </label>
              <input
                type="password"
                name="newPassword"
                value={passData.newPassword}
                onChange={handlePassChange}
                className={inputClass}
                required
                minLength={6}
              />
            </div>
            {/* Botón estándar rojo para contraseña */}
            <Button type="submit" color="failure" className="w-full mt-8">
              {t("profile.btn_change_password")}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default Profile;
