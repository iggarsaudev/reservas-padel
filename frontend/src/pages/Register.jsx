import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Label, TextInput, Card } from "flowbite-react";
import toast from "react-hot-toast";
import api from "../services/api";

function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Configuración del formulario
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Llamada
      await api.post("/users", {
        name: data.name,
        surnames: data.surnames,
        email: data.email,
        password: data.password,
      });

      toast.success(t("auth.success_register"));
      navigate("/login"); // Redirigimos al login para que entre
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.error || "Error al registrarse";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <Card className="w-full max-w-md shadow-xl dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
          {t("auth.register_title")}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Nombre y Apellidos */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full">
              <div className="mb-2 block">
                <Label htmlFor="name" value={t("auth.name_label")} />
              </div>
              <TextInput
                id="name"
                placeholder="Nacho"
                color={errors.name ? "failure" : "gray"}
                {...register("name", {
                  required: t("auth.validation_required"),
                })}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="w-full">
              <div className="mb-2 block">
                <Label htmlFor="surnames" value={t("auth.surnames_label")} />
              </div>
              <TextInput
                id="surnames"
                placeholder="Pérez"
                color={errors.surnames ? "failure" : "gray"}
                {...register("surnames", {
                  required: t("auth.validation_required"),
                })}
              />
              {errors.surnames && (
                <span className="text-red-500 text-sm">
                  {errors.surnames.message}
                </span>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value={t("auth.email_label")} />
            </div>
            <TextInput
              id="email"
              type="email"
              placeholder="tu@email.com"
              color={errors.email ? "failure" : "gray"}
              {...register("email", {
                required: t("auth.validation_required"),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email inválido",
                },
              })}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value={t("auth.password_label")} />
            </div>
            <TextInput
              id="password"
              type="password"
              placeholder="••••••••"
              color={errors.password ? "failure" : "gray"}
              {...register("password", {
                required: t("auth.validation_required"),
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
              })}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Botón Enviar */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white"
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Cargando...
              </>
            ) : (
              t("auth.register_title")
            )}
          </Button>
        </form>

        {/* Link a Login */}
        <div className="flex items-center justify-center mt-4 text-sm">
          <span className="text-gray-500 dark:text-gray-400 mr-2">
            {t("auth.yes_account")}
          </span>
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            {t("auth.link_login")}
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default Register;
