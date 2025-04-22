import { addToast, Button, Form, Input } from "@heroui/react"
import axios from "axios"
import { useState } from "react"
import { useAuth } from "../store/useAuth"
import { useNavigate } from "react-router"

export const ChangePassword = () => {

    const [showFormNewPassword, setShowFormNewPassword] = useState(false)
    const [validateCurrentPassword, setValidateCurrentPassword] = useState(false)
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({});
    const navigate = useNavigate()
    const { user, token } = useAuth();

    const validatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            const data = Object.fromEntries(new FormData(e.currentTarget))
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/validate_current_password`,
                {
                    currentPassword: data.passwordToValidate,
                    email: user?.email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            if (response.status === 200) {
                setShowFormNewPassword(true)
                setValidateCurrentPassword(false)
                addToast({
                    title: "Contraseña correcta",
                    description: response.data.message,
                    color: "success",
                    timeout: 5000
                })
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    if (error.response.status === 401) {
                        addToast({
                            title: "Contraseña incorrecta",
                            description: error.response.data.message,
                            color: "danger",
                            timeout: 5000
                        })
                    }
                }
            }
        }
    }

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
                email: user?.email
            })
            addToast({
                title: "Contraseña actualizada",
                description: response.data.message,
                color: "success",
                timeout: 5000
            })
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

    return <main className="flex flex-col gap-3 w-full md:w-1/2">
        <h1 className="text-lg font-semibold">
            Contraseña
        </h1>
        {
            (!validateCurrentPassword && !showFormNewPassword) &&
            <Button onPress={() => { setValidateCurrentPassword(true) }} color="primary" className="w-full font-semibold">Cambiar contraseña</Button>
        }
        {
            validateCurrentPassword &&
            <Form onSubmit={(e) => validatePassword(e)} className="flex flex-col gap-3">
                <Input variant="bordered"
                    name="passwordToValidate"
                    isRequired
                    label="Contraseña actual"
                    labelPlacement="outside"
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Ingresa tu contraseña actual"
                    validate={(value) => {
                        if (!value) return "El campo no puede estar en blanco";
                    }}
                    endContent={
                        <div className="bg-transparent select-none text-zinc-500 hover:text-zinc-700 transition-colors cursor-pointer text-sm" onClick={() => setPasswordVisible(!passwordVisible)}>
                            {passwordVisible ?
                                "Ocultar"
                                : "Mostrar"}
                        </div>
                    } />
                <Button color="primary" type="submit" className="w-full font-semibold">Continuar</Button>
            </Form>
        }
        {
            showFormNewPassword &&
            <Form validationErrors={errors} onSubmit={(e) => { onSubmit(e) }} className="w-full flex flex-col gap-3">
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

        }
    </main>
}