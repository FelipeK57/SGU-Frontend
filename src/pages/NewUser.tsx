import { addToast, Button, Form, Input, Select, SelectItem } from "@heroui/react"
import { useFetchWorkAreas } from "../store/useWorkArea";
import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useAuth } from "../store/useAuth";

export const NewUser = () => {

    const { token } = useAuth();
    const { workAreas } = useFetchWorkAreas();
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    const documentTypes = [
        { key: "cc", label: "Cédula de ciudadanía" },
        { key: "ti", label: "Tarjeta de identidad" },
        { key: "ce", label: "Cédula de extranjería" },
        { key: "pa", label: "Pasaporte" },
        { key: "nit", label: "NIT" },
        { key: "rc", label: "Registro civil" },
        { key: "nuip", label: "NUIP" },
        { key: "other", label: "Otro" }
    ];

    const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            const data = Object.fromEntries(new FormData(e.currentTarget))

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users`, {
                name: data.name,
                lastName: data.lastName,
                email: data.email,
                documentType: data.documentType,
                documentNumber: data.documentNumber,
                workAreaId: Number(data.workArea),
                role: "employee",
                password: data.documentNumber
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.status === 201) {
                navigate("/dashboard/users")
                addToast({
                    title: "Usuario creado",
                    description: response.data.message,
                    timeout: 3000,
                    color: "success"
                })
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }

    }

    return <main className="flex flex-col items-center gap-3 w-full md:max-w-sm mx-auto">
        <h1 className="text-lg font-semibold">Crear nuevo usuario</h1>
        <Form onSubmit={(e) => createUser(e)} className="flex flex-col gap-3 w-full">
            <Input isRequired name="name" label="Nombre" labelPlacement="outside" placeholder="Ingresa tu nombre" variant="bordered" validate={(value) => {
                if (!value) return "El campo no puede estar en blanco"
            }} />
            <Input isRequired name="lastName" label="Apellido" labelPlacement="outside" placeholder="Ingresa tu apellido" variant="bordered" validate={(value) => {
                if (!value) return "El campo no puede estar en blanco"
            }} />
            <Input isRequired name="email" label="Correo Electrónico" labelPlacement="outside" placeholder="Ingresa tu correo electrónico" variant="bordered" validate={(value) => {
                if (!value) return "El campo no puede estar en blanco"
                if (!value.includes("@")) return "Correo no válido"
            }} />
            <Select isRequired name="documentType" variant="bordered" placeholder="Seleccione un tipo de documento" label="Tipo de documento" labelPlacement="outside" validate={(value) => {
                if (!value) return "El campo no puede estar en blanco"
            }}>
                {
                    documentTypes.map((documentType) => {
                        return <SelectItem key={documentType.key}>{documentType.label}</SelectItem>
                    })
                }
            </Select>
            <Input isRequired name="documentNumber" label="Número de documento" labelPlacement="outside" placeholder="Ingresa tu número de documento" variant="bordered" validate={(value) => {
                if (!value) return "El campo no puede estar en blanco"
            }} />
            <Select isRequired name="workArea" variant="bordered" label="Área" placeholder="Seleccione un área de trabajo" labelPlacement="outside" validate={(value) => {
                if (!value) return "El campo no puede estar en blanco"
            }}>
                {
                    workAreas.map((workArea) => {
                        return <SelectItem key={workArea.id}>{workArea.name}</SelectItem>
                    })
                }
            </Select>
            <div className="flex flex-row gap-3 w-full">
                <Button onPress={() => navigate("/dashboard/users")} variant="bordered" color="default" className="font-semibold w-full">
                    Cancelar
                </Button>
                <Button type="submit" isLoading={isLoading} color="primary" className="font-semibold w-full">
                    Crear
                </Button>
            </div>
        </Form>
    </main>
}