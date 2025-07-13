import { addToast, Button, Form, Input } from "@heroui/react"
import axios from "axios"
import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "../store/useAuth"

export const RecoveryPassword = () => {

  const [isLoading, setIsLoading] = useState(false)
  const { setRecoveryEmail } = useAuth();
  const navigate = useNavigate();

  const sendCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const data = Object.fromEntries(new FormData(e.currentTarget))
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/send_reset_code`, {
        email: data.email
      })
      addToast({
        title: "Código enviado",
        description: response.data.message,
        color: "success",
        timeout: 5000
      })
      setRecoveryEmail(data.email as string)
      navigate("/recovery-password/verify-code")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          addToast({
            title: "Error",
            description: error.response.data.message,
            color: "danger",
            timeout: 5000
          })
        } else {
          addToast({
            title: "Error",
            description: "Error inesperado, por favor intente más tarde.",
            color: "danger",
            timeout: 5000
          })
        }
      } else {
        addToast({
          title: "Error",
          description: "Error inesperado, por favor intente más tarde.",
          color: "danger",
          timeout: 5000
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="grid grid-rows-[1fr_auto_1fr] min-h-screen ">
      <div></div>
      <section className="flex flex-col h-full gap-5 items-center justify-center max-w-80 md:max-w-96 mx-auto">
        <h1 className="font-semibold text-xl">
          Recuperar contraseña
        </h1>
        <h3 className="text-sm font-normal">Ingresa tu correo electrónico y te enviaremos un código para continuar con la recuperación.</h3>
        <Form onSubmit={(e) => sendCode(e)} className="w-full flex flex-col gap-5">
          <Input autoComplete="email" isRequired name="email" label="Correo Electrónico" labelPlacement="outside" placeholder="Ingresa tu correo electrónico" variant="bordered" validate={(value) => {
            if (!value) return "El campo no puede estar en blanco";
            if (!value.includes("@")) return "Ingresa un correo electrónico válido, como ejemplo@correo.com.";
          }} />
          <Button isLoading={isLoading} isDisabled={isLoading} type="submit" color="primary" className="w-full font-semibold">Enviar código</Button>
        </Form>

      </section>
      <nav className="flex items-end justify-center">
        <p onClick={() => { navigate(-1) }} className="text-sm font-normal pb-6 underline w-full text-center">
          Volver al inicio de sesión
        </p>
      </nav>
    </main>
  )
}