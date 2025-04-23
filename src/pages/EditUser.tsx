import { useEffect, useState } from "react"
import { useAuth, useUserStore } from "../store/useAuth";
import axios from "axios";
import { useNavigate } from "react-router";
import { UserDataResponse } from "./MyAccount";
import { Spinner } from "@heroui/react";

export const EditUser = () => {

    const { email } = useUserStore()
    const { token } = useAuth()
    const navigate = useNavigate()
    const [userData, setUserData] = useState<UserDataResponse | null>(null);

    useEffect(() => {
        if (!email) {
            navigate("/dashboard/users")
            return
        }

        const getUserData = async () => {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${email}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setUserData(response.data.user)
        }
        setTimeout(() => {
            getUserData()
        }, 500)
    }, [email, token])

    if (!userData) return <div className="flex items-center justify-center w-full"><Spinner variant="dots" /></div>

    return <main className="flex flex-col items-center gap-3 w-full md:max-w-sm mx-auto">
        <h1 className="font-semibold text-lg">Editar datos del usuario</h1>
        {
            userData && (
                <>
                    <p>
                        Nombre: <span className="font-semibold">{userData.name} {userData.lastName}</span>
                    </p>
                    <p>
                        Correo: <span className="font-semibold">{userData.email}</span>
                    </p>
                    <p>
                        Identificación: <span className="font-semibold">{userData.documentNumber}</span>
                    </p>
                    <p>
                        Área: <span className="font-semibold">{userData.workArea}</span>
                    </p>
                    <p>
                        Tipo de documento: <span className="font-semibold">{userData.documentType}</span>
                    </p>
                    <p className="text-sm text-gray-500">Recuerda que no puedes editar tu correo electrónico, si deseas cambiarlo, por favor contacta al administrador del sistema.</p>
                </>
            )
        }
    </main>
}