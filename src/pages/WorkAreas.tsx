import { addToast, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Form, Input } from "@heroui/react"
import { useState } from "react"
import { useFetchWorkAreas } from "../store/useWorkArea";
import axios from "axios";

export const WorkAreas = () => {
    const [showNewWorkAreaForm, setShowNewWorkAreaForm] = useState(false);

    const [name, setName] = useState("")
    const [workAreaId, setWorkAreaId] = useState<number | null>(null)
    const [editMode, setEditMode] = useState(false)

    const { workAreas, fetchWorkAreas } = useFetchWorkAreas()

    const editWorkArea = async () => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/work-areas/${workAreaId}`, {
                name: name
            })
            if (response.status === 200) {
                fetchWorkAreas();
                addToast({
                    title: "Área actualizada",
                    description: "El área de trabajo ha sido actualizada correctamente",
                    color: "success",
                    timeout: 5000
                })

            }
        } catch (error) {
            console.error(error)
        }
    }

    const createNewWorkArea = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (showNewWorkAreaForm || editMode) {
            try {
                if (editMode) {
                    editWorkArea()
                    return;
                }
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/work-areas`, {
                    name: name
                })
                if (response.status === 201) {
                    fetchWorkAreas();
                    addToast({
                        title: "Área creada",
                        description: "Ha sido creada exitosamente la nueva área de trabajo",
                        color: "success",
                        timeout: 5000
                    })
                }
            } catch (error) {
                console.error(error)
            } finally {
                setShowNewWorkAreaForm(false)
            }
        } else {
            setShowNewWorkAreaForm(true)
        }
    }

    return (
        <main className="flex flex-col gap-3 w-full">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold">
                    Áreas
                </h1>
                {
                    (showNewWorkAreaForm || editMode) && (
                        <Button
                            onPress={() => {
                                showNewWorkAreaForm && setShowNewWorkAreaForm(false);
                                editMode && setEditMode(false);
                                setName("")
                                setWorkAreaId(null)
                            }}
                            color="danger"
                            variant="light"
                        >
                            Cancelar {showNewWorkAreaForm ? "crear" : "editar"}
                        </Button>
                    )
                }
            </div>
            <section className="flex flex-col gap-3">
                <Form onSubmit={(e) => createNewWorkArea(e)}>
                    {
                        (showNewWorkAreaForm || editMode) && (
                            <Input value={name} onChange={(e) => { setName(e.target.value) }} label="Nombre" labelPlacement="outside" validate={(value) => {
                                if (!value) return "El campo no puede estar en blanco"
                            }} placeholder="Ingresa el nombre" variant="bordered" className="w-full" />

                        )
                    }
                    <Button type="submit" color="primary" className="w-full font-semibold">
                        {
                            editMode ? "Confirmar cambio" : "Crear nueva área"
                        }
                    </Button>
                </Form>
                <div className="flex flex-col w-full gap-0">

                    {
                        workAreas.map((workArea) => {
                            return (<div key={workArea.name} className={`${workAreas.indexOf(workArea) === 0 && "border-t-1"} flex justify-between items-center w-full border-b-1 border-zinc-200 h-14  px-3`}>
                                <p>
                                    {workArea.name}
                                </p>
                                <div className="block md:hidden">
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <Button isIconOnly className="rounded-full" color="default" variant="bordered">
                                                <ThreePoint />
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu aria-label="Static Actions">
                                            <DropdownItem onPress={() => {
                                                setEditMode(true)
                                                setName(workArea.name)
                                                setWorkAreaId(workArea.id)
                                            }} key="new">Editar</DropdownItem>
                                            <DropdownItem key="delete" className="text-danger" color="danger">
                                                Eliminar
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                                <div className="hidden md:flex md:gap-3">
                                    <Button onPress={() => {
                                        setEditMode(true)
                                        setWorkAreaId(workArea.id)
                                    }} className="bg-opacity-20">
                                        Editar
                                    </Button>
                                    <Button color="danger" variant="light">
                                        Eliminar
                                    </Button>
                                </div>
                            </div>)
                        })
                    }
                </div>
            </section>
        </main>
    )
}

export const ThreePoint = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
}