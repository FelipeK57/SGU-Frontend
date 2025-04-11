import { addToast, Button, Form, Input } from "@heroui/react";
import { Link } from "react-router";
import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { setCookie } from "typescript-cookie";
import { useAuth } from "../store/useAuth";
import { useNavigate } from "react-router";

export interface PayloadJWT {
  id: string;
  email: string;
  role: string;
}

export const Login = () => {
  // State where we will store the errors of the form
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [passwordVisible, setPasswordVisible] = useState(false);

  const { login } = useAuth();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);
    let data = Object.fromEntries(new FormData(e.currentTarget));
    if (!data.email && !data.password) {
      setErrors({ email: "Campo requerido", password: "Campo requerido" });
      return;
    }
    if (!data.email) {
      setErrors({ email: "Campo requerido" });
      return;
    }
    if (!data.password) {
      setErrors({ password: "Campo requerido" });
      return;
    }
    if (!(data.email as string).includes("@")) {
      setErrors({ email: "Formato de correo inválido" });
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email: data.email,
          password: data.password,
        }
      );
      const token = response.data.token;
      setCookie("token", token, { expires: 7 });
      const payload = jwtDecode<PayloadJWT>(token);
      login(token, { email: payload.email, role: payload.role });
      navigate("/dashboard/users");
      addToast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido a SEMCON",
        hideIcon: true,
        timeout: 3000,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 401) {
            addToast({
              title: "Error",
              description: error.response.data.message,
              hideIcon: true,
              color: "danger",
              timeout: 3000,
            });
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col gap-5 items-center justify-center min-h-screen">
      <div className="w-full text-center">
        <h1 className="font-semibold text-xl">Inicio de sesión</h1>
        <h3 className="text-sm font-light">Sistema de gestión de usuarios</h3>
      </div>
      <img
        alt="Logo de SEMCON"
        className="h-fit w-80 md:w-96"
        src="Logo_Semcon_2021.png"
      />
      <Form
        onSubmit={(e) => onSubmit(e)}
        validationErrors={errors}
        className="max-w-80 md:max-w-96 w-full flex flex-col gap-5"
      >
        <Input
          variant="bordered"
          name="email"
          isRequired
          label="Correo Electrónico"
          labelPlacement="outside"
          placeholder="Ingresa tu correo electrónico"
          type="email"
          validate={(value) => {
            if (!value) return "Campo requerido";
            if (!value.includes("@")) return "Formato de correo inválido";
          }}
        />
        <Input
          variant="bordered"
          name="password"
          isRequired
          label="Contraseña"
          labelPlacement="outside"
          type={passwordVisible ? "text" : "password"}
          placeholder="Ingresa tu contraseña"
          validate={(value) => {
            if (!value) return "Campo requerido";
          }}
          endContent={
            <div className="bg-transparent select-none text-zinc-500 hover:text-zinc-700 transition-colors cursor-pointer text-sm" onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ?
                "Ocultar"
                : "Mostrar"}
            </div>
          }
        />
        <Button
          isLoading={isLoading}
          disabled={isLoading}
          type="submit"
          className="w-full bg-primary text-white font-semibold"
        >
          Iniciar sesión
        </Button>
        <Link
          to={"/recovery-password"}
          className="text-sm font-light underline w-full text-center"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </Form>
    </main>
  );
};
