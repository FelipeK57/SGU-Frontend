import { addToast, Button, Form, Image, Input } from "@heroui/react";
import { Link } from "react-router";
import { useWindowWidth } from "../hooks/useWidth";
import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { setCookie } from "typescript-cookie";

interface PayloadJWT {
  id: string;
  email: string;
  role: string;
}

export const Login = () => {
  // State where we will store the errors of the form
  const [errors, setErrors] = useState({});
  const width = useWindowWidth();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      console.log(payload);

      addToast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido a SEMCON",
        hideIcon: true,
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
            });
          }
        }
      }
    }
  };

  return (
    <main className="flex flex-col gap-5 items-center justify-center min-h-screen">
      <h1 className="font-semibold text-xl">Inicio de sesión</h1>
      <Image
        alt="Logo de SEMCON"
        width={width >= 768 ? 400 : 350}
        height={150}
        src="Logo_Semcon_2021.png"
      />
      <Form
        onSubmit={(e) => onSubmit(e)}
        validationErrors={errors}
        className="max-w-[350px] md:max-w-[400px] w-full flex flex-col gap-5"
      >
        <Input
          name="email"
          isRequired
          label="Correo Electrónico"
          labelPlacement="outside"
          placeholder="Ej: nombre@mail.com"
          type="email"
          validate={(value) => {
            if (!value) return "Campo requerido";
            if (!value.includes("@")) return "Formato de correo inválido";
          }}
        />
        <Input
          name="password"
          isRequired
          label="Contraseña"
          labelPlacement="outside"
          type="password"
          placeholder="********"
          validate={(value) => {
            if (!value) return "Campo requerido";
          }}
        />
        <Button
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
