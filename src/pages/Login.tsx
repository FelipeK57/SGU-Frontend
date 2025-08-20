import { addToast, Button, Form, Input } from "@heroui/react";
import { Link } from "react-router";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../store/useAuth";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";

export interface PayloadJWT {
  id: string;
  email: string;
  role: string;
}

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [passwordVisible, setPasswordVisible] = useState(false);

  const { login, setUser } = useAuth();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    let data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email: data.email,
          password: data.password,
        }
      );
      const token = response.data.token;
      const payload = jwtDecode<PayloadJWT>(token);
      setUser(payload.email, payload.role)
      login(token);
      navigate("/dashboard/users");
      addToast({
        title: "Inicio de sesión exitoso",  
        description: "Bienvenido al sistema de gestión de usuarios",
        timeout: 3000,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 401) {
            addToast({
              title: "Error",
              description: error.response.data.message,
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
    <main className="flex flex-col gap-5 items-center justify-center min-h-svh">
      <div className="w-full text-center">
        <h1 className="font-semibold text-xl">Inicio de sesión</h1>
        <h3 className="text-sm font-normal">Sistema de gestión de usuarios</h3>
      </div>
      <img
        alt="Logo de SEMCON"
        className="h-fit w-80 md:w-96"
        src="Logo_Semcon_2021.png"
      />
      <Form
        onSubmit={(e) => onSubmit(e)}
        className="max-w-80 md:max-w-96 w-full flex flex-col gap-5"
      >
        <Input
          variant="bordered"
          name="email"
          autoComplete="email"
          isRequired
          label="Correo Electrónico"
          labelPlacement="outside"
          placeholder="Ingresa tu correo electrónico"
          type="email"
          validate={(value) => {
            if (!value) return "El campo no puede estar en blanco";
            if (!value.includes("@")) return "Ingresa un correo electrónico válido, como ejemplo@correo.com.";
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
            if (!value) return "El campo no puede estar en blanco";
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
          className="text-sm font-normal underline w-full text-center"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </Form>
    </main>
  );
};
