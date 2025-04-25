import { useNavigate } from "react-router"
import { User } from "../pages/UsersManagement"
import { addToast, Button } from "@heroui/react"
import axios from "axios"
import { useAuth, useUserStore } from "../store/useAuth"

interface RowUserProps {
    user: User
    reload: boolean
    setReload: (reload: boolean) => void
}

export const RowUser = ({ user, reload, setReload }: RowUserProps) => {
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

    return (
        <div key={user.id} className="grid [grid-template-columns:15%_20%_25%_20%_20%] gap-2 px-4 items-center h-14 border-b-1 border-zinc-200">
            <p className="text-sm">{user.documentNumber}</p>
            <p className="text-sm truncate overflow-hidden text-ellipsis whitespace-nowrap">{user.name} {user.lastName}</p>
            <p className="text-sm truncate overflow-hidden text-ellipsis whitespace-nowrap">{user.email}</p>
            <p className="text-sm truncate overflow-hidden text-ellipsis whitespace-nowrap">{user.workArea}</p>
            <div className="flex flex-row gap-2 w-4/5">
                <Button onPress={() => handleEdit()} color="primary" variant="bordered" className="w-full">
                    Editar
                </Button>
                <Button onPress={() => changeStatus()} color={user.active ? "danger" : "success"} variant="bordered" className={`w-full`} >
                    {user.active ? "Desactivar" : "Activar"}
                </Button>
            </div>
        </div>
    )
}