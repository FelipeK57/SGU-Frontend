import { addToast, Button, Form, Input, Select, SelectItem, Spinner } from "@heroui/react"
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../store/useAuth";
import { useFetchWorkAreas } from "../store/useWorkArea";

export interface UserDataResponse {
    id: number,
    name: string,
    lastName: string,
    email: string,
    documentType: string,
    documentNumber: string,
    workArea: string
}

export const MyAccount = () => {

    const { user, token } = useAuth();
    const { workAreas } = useFetchWorkAreas();

    const [userData, setUserData] = useState<UserDataResponse | null>(null);
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [documentType, setDocumentType] = useState("");
    const [documentNumber, setDocumentNumber] = useState("");
    const [workArea, setWorkArea] = useState("");
    const [isModified, setIsModified] = useState(false);
    const [reload, setReload] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [errors, setErrors] = useState({})

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

    useEffect(() => {
        const getAccountInfo = async () => {
            if (!user || !token) return;
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${user?.email}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const fetchedUser: UserDataResponse = response.data.user;
            setName(fetchedUser.name);
            setLastName(fetchedUser.lastName);
            setEmail(fetchedUser.email);
            setDocumentNumber(fetchedUser.documentNumber);
            setDocumentType(fetchedUser.documentType);
            setWorkArea(fetchedUser.workArea);

            setUserData(fetchedUser)
        }
        setTimeout(() => {
            getAccountInfo()
        }, 300)
    }, [user?.email, token, reload])

    useEffect(() => {
        if (!userData) return;

        const hasChanges =
            userData.name !== name ||
            userData.lastName !== lastName ||
            userData.email !== email ||
            userData.documentNumber !== documentNumber ||
            userData.documentType !== documentType ||
            userData.workArea !== workArea


        setIsModified(hasChanges);

    }, [name, lastName, email, documentType, documentNumber, workArea, userData]);

    const saveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setIsLoading(true)

            const data = Object.fromEntries(new FormData(e.currentTarget))

            if (!(data.email as string).includes("@")) {
                setErrors({ email: "El correo electrónico no es válido" })
                return;
            }

            const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${userData?.id}`,
                {
                    name: name,
                    workArea: workArea,
                    lastName: lastName,
                    documentType: documentType,
                    documentNumber: documentNumber,
                    email: email
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                })
            if (response.status === 200) {
                setReload(!reload)
                addToast({
                    title: "Usuario actualizado",
                    description: response.data.message,
                    color: "success",
                    timeout: 3000
                })
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 400) {
                    addToast({
                        title: "Error al actualizar datos",
                        description: error.response.data.message,
                        color: "danger",
                        timeout: 3000
                    })
                }
            }
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 300);
        }
    }

    if (!userData) return <div className="flex items-center justify-center w-full"><Spinner variant="dots" /></div>

    return (
        <article className="flex flex-col gap-3 w-full md:w-1/2">
            <h1 className="text-lg font-semibold">
                Información personal
            </h1>
            <Form onSubmit={(e) => saveChanges(e)} validationErrors={errors} className="flex flex-col gap-3">
                <Input isRequired name="name" value={name} onValueChange={setName} label="Nombre" labelPlacement="outside" placeholder="Ingresa tu nombre" variant="bordered" />
                <Input isRequired name="lastName" value={lastName} onValueChange={setLastName} label="Apellido" labelPlacement="outside" placeholder="Ingresa tu apellido" variant="bordered" />
                <Input isRequired name="email" value={email} onValueChange={setEmail} label="Correo Electrónico" labelPlacement="outside" placeholder="Ingresa tu correo electrónico" variant="bordered" />
                <Select isRequired name="documentType" selectedKeys={[documentType]} onSelectionChange={(keys) => setDocumentType(Array.from(keys)[0] as string)} variant="bordered" placeholder="Seleccione un tipo de documento" label="Tipo de documento" labelPlacement="outside">
                    {
                        documentTypes.map((documentType) => {
                            return <SelectItem key={documentType.key}>{documentType.label}</SelectItem>
                        })
                    } 
                </Select>
                <Input isRequired name="documentNumber" value={documentNumber} onValueChange={setDocumentNumber} label="Número de documento" labelPlacement="outside" placeholder="Ingresa tu número de documento" variant="bordered" />
                <Select isRequired name="workArea" selectedKeys={[workArea]} onSelectionChange={(keys) => setWorkArea(Array.from(keys)[0] as string)} variant="bordered" label="Área" placeholder="Seleccione un área de trabajo" labelPlacement="outside">
                    {
                        workAreas.map((workArea) => {
                            return <SelectItem key={workArea.name}>{workArea.name}</SelectItem>
                        })
                    }
                </Select>
                <Button isLoading={isLoading} type="submit" isDisabled={!isModified} color="primary" className="font-semibold w-full">
                    Guardar cambios
                </Button>
            </Form>
        </article>
    )
}