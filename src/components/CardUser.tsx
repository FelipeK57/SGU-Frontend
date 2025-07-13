import { addToast, Button, Card, CardBody, CardFooter, CardHeader } from "@heroui/react"
import { User } from "../pages/UsersManagement"
import axios from "axios"
import { useAuth, useUserStore } from "../store/useAuth"
import { useNavigate } from "react-router"

interface CardUserProps {
    user: User
    reload: boolean
    setReload: (reload: boolean) => void
}

export const CardUser = ({ user, reload, setReload }: CardUserProps) => {

    const navigate = useNavigate()
    const { setEmail } = useUserStore()
    const { token } = useAuth()

    const changeStatus = async () => {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/set_status/${user.id}`, {
            active: !user.active
        },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        if (response.status === 200) {
            addToast({
                title: response.data.message,
                description: `El usuario ${user.name} ${user.lastName} ha sido ${user.active ? "desactivado" : "activado"}`,
                color: "success",
                timeout: 2000,
            })
            setReload(!reload)
        }
    }

    const handleEdit = () => {
        setEmail(user.email)
        navigate("/dashboard/edit-user")
    }

    return <Card className="bg-transparent p-2">
        <CardHeader className="font-semibold text-lg">{user.name} {user.lastName}</CardHeader>
        <CardBody className="flex flex-col gap-3 text-sm font-light">
            <p>Área: {user.workArea}</p>
            <p>Correo: {user.email}</p>
            <p>Identificación: {user.documentNumber}</p>
        </CardBody>
        <CardFooter className="flex flex-row gap-2">
            <Button onPress={() => handleEdit()} color="primary" variant="bordered" className="w-full font-semibold">
                Editar
            </Button>
            <Button onPress={() => changeStatus()} color={user.active ? "danger" : "success"} variant="bordered" className={`w-full font-semibold`} >
                {user.active ? "Desactivar" : "Activar"}
            </Button>
        </CardFooter>
    </Card>
}