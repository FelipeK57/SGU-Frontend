import { addToast, Button, Form, InputOtp } from "@heroui/react"
import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "../store/useAuth"

export const VerifyCode = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingResend, setIsLoadingResend] = useState(false)
  const navigate = useNavigate();
  const { recoveryEmail } = useAuth()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      setIsLoading(true)
      const data = Object.fromEntries(new FormData(e.currentTarget))
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/validate_reset_code`, {
        code: data.code,
        email: recoveryEmail
      })
      addToast({
        title: "Código verificado",
        description: response.data.message,
        color: "success",
        timeout: 5000
      })
      navigate("/recovery-password/new-password")
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
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }

  const resendCode = async () => {
    try {
      setIsLoadingResend(true)
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/send_reset_code`, {
        email: recoveryEmail
      })
      addToast({
        title: "Código enviado",
        description: response.data.message,
        color: "success",
        timeout: 5000
      })
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
      setTimeout(() => {
        setIsLoadingResend(false);
      }, 1000);
    }
  }

  return (
    <main className="grid grid-rows-[1fr_auto_1fr] min-h-screen ">
      <div></div>
      <section className="flex flex-col h-full gap-5 items-center justify-center max-w-80 md:max-w-96 mx-auto">
        <h1 className="font-semibold text-xl">
          Recuperar contraseña
        </h1>
        <h3 className="text-sm font-normal">Ingresa el código que te enviamos al correo electrónico.</h3>
        <Form onSubmit={(e) => onSubmit(e)} className="w-full flex flex-col gap-5">
          <div className="flex flex-col justify-center gap-0 w-full">
            <p className="text-sm">Código<span className="text-danger-500">*</span></p>
            <div className="flex w-full justify-center">
              <InputOtp
                length={6}
                name="code"
                variant="bordered"
                validate={(value) => {
                  if (value.length < 6) {
                    return "El código debe tener 6 dígitos"
                  }
                  return true
                }}
                classNames={{
                  base: "w-full",
                  segmentWrapper: "flex justify-between gap-2 w-full",
                  segment: [
                    "flex-1",
                    "h-12",
                    "text-center",
                  ],
                }}
              />
            </div>
          </div>
          <Button isLoading={isLoading} isDisabled={isLoading} type="submit" color="primary" className="w-full font-semibold">Continuar</Button>
          <p className="text-sm font-normal">Si no recibiste el código solicita uno nuevo, los códigos enviados anteriormente seran invalidados.</p>
          <Button isLoading={isLoadingResend} isDisabled={isLoadingResend} variant="bordered" className="w-full font-semibold" onPress={() => resendCode()}>Reenviar código</Button>
        </Form>

      </section>
      <></>
    </main>
  )
}