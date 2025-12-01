import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import Login from "../pages/Login";

// Mocks necesarios (simulamos las librerías externas)
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }), // Devuelve la clave tal cual
}));

// Mock del AuthContext
const mockLogin = vi.fn();
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: false,
  }),
}));

// Mock de React Router (useNavigate)
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Login Component", () => {
  it("debería renderizar el formulario correctamente", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // CAMBIO: Buscamos por placeholder en lugar de LabelText
    expect(screen.getByPlaceholderText(/tu@email.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();

    // El botón sí lo buscamos por Role
    expect(
      screen.getByRole("button", { name: /auth.login_button/i })
    ).toBeInTheDocument();
  });

  it("debería mostrar errores de validación si se envía vacío", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const submitBtn = screen.getByRole("button", {
      name: /auth.login_button/i,
    });
    fireEvent.click(submitBtn);

    // Esperamos a que aparezcan los mensajes de error
    // (Como mockeamos la traducción, buscará la clave "auth.validation_required")
    await waitFor(() => {
      expect(screen.getAllByText(/auth.validation_required/i)).toHaveLength(2); // Email y Pass
    });

    // Aseguramos que NO se llamó a la función login real
    expect(mockLogin).not.toHaveBeenCalled();
  });
});
