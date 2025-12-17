import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Label, TextInput, Card } from "flowbite-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Si ya estoy logueado, me envía a /reservas
  useEffect(() => {
    if (isAuthenticated) navigate("/reservas");
  }, [isAuthenticated, navigate]);

  // Configuración del formulario
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Función que se ejecuta al enviar
  const onSubmit = async (data) => {
    try {
      const user = await login(data.email, data.password);
      toast.success(t("auth.success_login", { name: user.name }));
      navigate("/reservas");
    } catch (error) {
      console.error(error);
      toast.error(t("auth.error_login"));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md shadow-xl dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
          {t("auth.login_title")}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Email */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value={t("auth.email_label")} />
            </div>
            <TextInput
              id="email"
              type="email"
              placeholder="tu@email.com"
              color={errors.email ? "failure" : "gray"} // Rojo si hay error
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
                minLength: {
                  value: 6,
                  message: t("auth.validation_password_min"),
                },
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
              t("auth.login_title")
            )}
          </Button>
        </form>

        {/* Link a Registro */}
        <div className="flex items-center justify-center mt-4 text-sm">
          <span className="text-gray-500 dark:text-gray-400 mr-2">
            {t("auth.no_account")}
          </span>
          <Link
            to="/register"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            {t("auth.link_register")}
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default Login;
