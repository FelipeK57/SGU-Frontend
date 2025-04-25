import { useEffect, useState } from "react"
import { useAuth } from "../store/useAuth"
import axios from "axios"
import { Button, Spinner } from "@heroui/react";
import { CardExternalSystem } from "../components/CardExternalSystem";

export interface ExternalSystems {
    id: number;
    name: string;
    key: string;
    url: string;
}

export const ExternalSystemsManagement = () => {

    const { token } = useAuth()

    const [externalSystems, setExternalSystems] = useState<ExternalSystems[] | null>(null)

    useEffect(() => {
        const fetchExternalSystems = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/external-systems`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                })

                const externalSystems: ExternalSystems[] = response.data.externalSystems
                if (response.status === 200) {
                    setExternalSystems(externalSystems)
                }
            } catch (error) {
                console.error("Error fetching external systems:", error)
            }
        }
        setTimeout(() => {
            fetchExternalSystems()
        }, 300)
    }, [token])

    const columns = [
        {
            "name": "Nombre"
        },
        {
            "name": "URL"
        },
        {
            "name": "Key"
        },
        {
            "name": "Acciones"
        }
    ]

    if (!externalSystems) return <div className="flex items-center justify-center w-full"><Spinner variant="dots" /></div>

    return <main className="flex flex-col gap-3 w-full xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto">
        <h1 className="font-semibold text-lg">
            Sistemas Externos
        </h1>
        <p className="text-sm font-light">
            Esta sección está destinada a la gestión de sistemas externos. Aquí podrás añadir, editar o eliminar sistemas externos que usan la API de la aplicación.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 xl:hidden">
            {
                externalSystems.length > 0 ? (
                    externalSystems.map((externalSystem) => {
                        return <CardExternalSystem key={externalSystem.id} externalSystem={externalSystem} />
                    })
                ) : (<p className="grid place-content-center col-span-full w-full h-20 text-center text-sm font-light text-gray-500">
                    No hay sistemas externos.
                </p>)
            }
        </div>
        <div className="hidden xl:block">
            {
                externalSystems.length > 0 ? (
                    <>
                        <div className="grid grid-cols-4 gap-10 border-y-1 px-4 border-zinc-200">
                            {columns.map((column, index) => (
                                <div key={index} className="flex items-center text-left font-semibold text-sm h-14 py-2">
                                    {column.name}
                                </div>
                            ))}
                        </div>
                        {
                            externalSystems.map((externalSystem) => {
                                return <div key={externalSystem.id} className="grid grid-cols-4 gap-10 px-4 items-center h-20 md:h-14 py-2 border-b-1 border-zinc-200">
                                    <p className="text-sm">{externalSystem.name}</p>
                                    <a target="_blank" href={externalSystem.url} className="text-sm underline">{externalSystem.url}</a>
                                    <p className="text-sm truncate overflow-hidden text-ellipsis whitespace-nowrap">{externalSystem.key}</p>
                                    <div className="flex flex-row gap-2 w-full">
                                        <Button color="primary" variant="bordered" className="w-full">
                                            Administrar roles
                                        </Button>
                                        <Button color="danger" variant="bordered" className="w-full" >
                                            Eliminar
                                        </Button>
                                    </div>
                                </div>
                            })
                        }
                    </>
                ) : (
                    <p className="grid place-content-center col-span-full w-full h-20 text-center text-sm font-light text-gray-500">
                        No hay sistemas externos.
                    </p>
                )
            }
        </div>
    </main >
}