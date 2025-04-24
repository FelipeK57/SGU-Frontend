import { useEffect, useState } from "react"
import { useAuth, useUserStore } from "../store/useAuth";
import axios from "axios";
import { useNavigate } from "react-router";
import { UserDataResponse } from "./MyAccount";
import { addToast, Button, Form, Input, Select, SelectItem, Spinner } from "@heroui/react"
import { useFetchWorkAreas } from "../store/useWorkArea";

export const EditUser = () => {

    const { email } = useUserStore()
    const { token } = useAuth()
    const { workAreas } = useFetchWorkAreas();

    const navigate = useNavigate()

    const [userData, setUserData] = useState<UserDataResponse | null>(null);
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userEmail, setUserEmail] = useState("");
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
            const fetchedUser: UserDataResponse = response.data.user;
            setName(fetchedUser.name);
            setLastName(fetchedUser.lastName);
            setUserEmail(fetchedUser.email);
            setDocumentNumber(fetchedUser.documentNumber);
            setDocumentType(fetchedUser.documentType);
            setWorkArea(fetchedUser.workArea);

            setUserData(response.data.user)
        }
        setTimeout(() => {
            getUserData()
        }, 300)
    }, [email, token])

    useEffect(() => {
        if (!userData) return;

        const hasChanges =
            userData.name !== name ||
            userData.lastName !== lastName ||
            userData.email !== userEmail ||
            userData.documentNumber !== documentNumber ||
            userData.documentType !== documentType ||
            userData.workArea !== workArea


        setIsModified(hasChanges);

    }, [name, lastName, userEmail, documentType, documentNumber, workArea, userData]);

    const saveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setIsLoading(true)

            const data = Object.fromEntries(new FormData(e.currentTarget))
            if (!(data.userEmail as string).includes("@")) {
                setErrors({ userEmail: "El correo electrónico no es válido" })
                return
            }

            const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${userData?.id}`,
                {
                    name: name,
                    workArea: workArea,
                    lastName: lastName,
                    documentType: documentType,
                    documentNumber: documentNumber,
                    email: userEmail,
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
                navigate("/dashboard/users")
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

    return <main className="flex flex-col items-center gap-3 w-full md:max-w-sm mx-auto">
        <h1 className="font-semibold text-lg">Editar datos del usuario</h1>
        <Form onSubmit={(e) => saveChanges(e)} validationErrors={errors} className="flex flex-col gap-3 w-full">
            <Input isRequired name="name" value={name} onValueChange={setName} label="Nombre" labelPlacement="outside" placeholder="Ingresa tu nombre" variant="bordered" />
            <Input isRequired name="lastName" value={lastName} onValueChange={setLastName} label="Apellido" labelPlacement="outside" placeholder="Ingresa tu apellido" variant="bordered" />
            <Input isRequired name="userEmail" value={userEmail} onValueChange={setUserEmail} label="Correo Electrónico" labelPlacement="outside" placeholder="Ingresa tu correo electrónico" variant="bordered" />
            <Select isRequired name="documentType" selectedKeys={[documentType]} onSelectionChange={(keys) => setDocumentType(Array.from(keys)[0] as string)} variant="bordered" placeholder="Seleccione un tipo de documento" label="Tipo de documento" labelPlacement="outside">
                {
                    documentTypes.map((documentType) => {
                        return <SelectItem key={documentType.key}>{documentType.label}</SelectItem>
                    })
                }
            </Select>
            <Input isRequired name="documentNumber" value={documentNumber} onValueChange={setDocumentNumber} label="Número de documento" labelPlacement="outside" placeholder="Ingresa tu número de documento" variant="bordered" />
            <Select isRequired name="worArea" selectedKeys={[workArea]} onSelectionChange={(keys) => setWorkArea(Array.from(keys)[0] as string)} variant="bordered" label="Área" placeholder="Seleccione un área de trabajo" labelPlacement="outside" >
                {
                    workAreas.map((workArea) => {
                        return <SelectItem key={workArea.name}>{workArea.name}</SelectItem>
                    })
                }
            </Select>
            <div className="flex flex-row gap-3 w-full">
                <Button onPress={() => navigate("/dashboard/users")} variant="bordered" color="default" className="font-semibold w-full">
                    Cancelar
                </Button>
                <Button isLoading={isLoading} type="submit" isDisabled={!isModified} color="primary" className="font-semibold w-full">
                    Guardar cambios
                </Button>
            </div>
        </Form>
    </main>
}