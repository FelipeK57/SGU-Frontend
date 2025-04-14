import { addToast, Button, Form, Input } from "@heroui/react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../store/useAuth";

export const ChangePassword = () => {

    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({});
    const { recoveryEmail, setRecoveryEmail } = useAuth();
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState(false);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            const data = Object.fromEntries(new FormData(e.currentTarget))

            if ((data.newPassword as string).length < 8) {
                setErrors({ newPassword: "La contraseña debe tener al menos 8 caracteres" })
                return
            }

            if (!/[A-Z]/.test(data.newPassword as string)) {
                setErrors({ newPassword: "La contraseña debe tener al menos una letra mayúscula" })
                return
            }

            if (!/[a-z]/.test(data.newPassword as string)) {
                setErrors({ newPassword: "La contraseña debe tener al menos una letra minúscula" })
                return
            }

            if (!/[0-9]/.test(data.newPassword as string)) {
                setErrors({ newPassword: "La contraseña debe tener al menos un número" })
                return
            }

            if (data.newPassword !== data.confirmPassword) {
                setErrors({ confirmPassword: "Las contraseñas no coinciden" })
                return
            }

            setIsLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/reset_password`, {
                newPassword: data.newPassword,
                email: recoveryEmail
            })
            addToast({
                title: "La contraseña ha sido cambiada",
                description: response.data.message,
                color: "success",
                timeout: 5000
            })
            setRecoveryEmail("")
            navigate("/login")
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

    return (
        <main className="grid grid-rows-[1fr_auto_1fr] min-h-screen ">
            <div></div>
            <section className="flex flex-col h-full gap-5 items-center justify-center w-full max-w-80 md:max-w-96 mx-auto">
                <h1 className="font-semibold text-xl">
                    Cambio de contraseña
                </h1>
                <Form validationErrors={errors} onSubmit={(e) => { onSubmit(e) }} className="w-full flex flex-col gap-5">
                    <Input
                        variant="bordered"
                        name="newPassword"
                        isRequired
                        label="Nueva contraseña"
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
                    <Input
                        variant="bordered"
                        name="confirmPassword"
                        isRequired
                        label="Confirmar contraseña"
                        labelPlacement="outside"
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Confirma tu contraseña"
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
                    <Button isLoading={isLoading} isDisabled={isLoading} type="submit" color="primary" className="w-full font-semibold">Confirmar cambio</Button>
                </Form>

            </section>
            <></>
        </main>
    )
}