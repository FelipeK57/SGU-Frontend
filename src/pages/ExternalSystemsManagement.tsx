import { useEffect, useState } from "react"
import { useAuth } from "../store/useAuth"
import axios from "axios"
import { addToast, Button, Form, Input } from "@heroui/react";
import { CardExternalSystem } from "../components/CardExternalSystem";
import { ConfirmDialogExternalSystems } from "../components/ConfirmDialogExternalSystem";
import { useNavigate } from "react-router";

export interface ExternalSystems {
    id: number;
    name: string;
    key: string;
    url: string;
}

export const ExternalSystemsManagement = () => {

    const { token } = useAuth()

    const navigate = useNavigate();

    const [externalSystems, setExternalSystems] = useState<ExternalSystems[] | null>(null)
    const [reload, setReload] = useState(false)
    const [showFormNewExternalSystem, setShowFormNewExternalSystem] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
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
    }, [token, reload])

    const deleteExternalSystem = async (id: number) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/external-systems/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.status === 200) {
                addToast({
                    title: "Sistema externo eliminado",
                    description: response.data.message,
                    color: "success",
                    timeout: 5000
                })
                setReload(!reload)
            }
        } catch (error) {
            console.error(error)
        }
    }

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

    const handleFormExternalSystem = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (showFormNewExternalSystem) {
            const data = Object.fromEntries(new FormData(e.currentTarget))
            setIsLoading(true)
            const name = data.name
            const url = data.url
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/external-systems`,
                    {
                        name: name,
                        url: url
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                if (response.status === 201) {
                    setReload(!reload)
                    addToast({
                        title: "Sistema externo creado",
                        description: response.data.message,
                        color: "success",
                        timeout: 5000
                    })
                }
                setShowFormNewExternalSystem(false)
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        } else {
            setShowFormNewExternalSystem(true)
        }
    }

    return <main className="flex flex-col gap-3 w-full xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto">
        <h1 className="font-semibold text-lg">
            Sistemas Externos
        </h1>
        <p className="text-sm font-light">
            Esta sección está destinada a la gestión de sistemas externos. Aquí podrás añadir, editar o eliminar sistemas externos que usan la API de la aplicación.
        </p>
        {
            <Form onSubmit={(e) => handleFormExternalSystem(e)}>
                {
                    showFormNewExternalSystem &&
                    <div className="flex flex-col gap-3 w-full md:w-1/3">
                        <Input isRequired name="name" label="Nombre" variant="bordered" labelPlacement="outside" placeholder="Ingresa el nombre" />
                        <Input isRequired name="url" label="URL" variant="bordered" labelPlacement="outside" placeholder="Ingresa la url" />
                    </div>
                }
                <div className="flex flex-row gap-3 w-full md:w-1/3">
                    {
                        showFormNewExternalSystem &&
                        <Button onPress={() => setShowFormNewExternalSystem(false)} variant="bordered" color="default" className="font-semibold w-full">
                            Cancelar
                        </Button>
                    }
                    <Button isLoading={isLoading} isDisabled={isLoading} type="submit" color="primary" className="font-semibold w-full">
                        {showFormNewExternalSystem ? "Crear" : "Registrar nuevo"}
                    </Button>
                </div>
            </Form>
        }
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 xl:hidden">
            {
                externalSystems && externalSystems.length > 0 ? (
                    externalSystems.map((externalSystem) => {
                        return <CardExternalSystem key={externalSystem.id} deleteExternalSystem={deleteExternalSystem} externalSystem={externalSystem} />
                    })
                ) : (<p className="grid place-content-center col-span-full w-full h-20 text-center text-sm font-light text-gray-500">
                    No hay sistemas externos.
                </p>)
            }
        </div>
        <div className="hidden xl:block">
            {
                externalSystems && externalSystems.length > 0 ? (
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
                                        <Button onPress={() => navigate(`/dashboard/external-systems/${externalSystem.id}`)} color="primary" variant="bordered" className="w-full">
                                            Administrar roles
                                        </Button>
                                        <ConfirmDialogExternalSystems onConfirm={() => deleteExternalSystem(externalSystem.id)} />
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