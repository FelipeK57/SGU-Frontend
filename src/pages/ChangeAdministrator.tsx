import { useEffect, useState } from "react"
import { MinusIcon, SearchIcon, User } from "./UsersManagement"
import { Input, Spinner } from "@heroui/react"
import { useAuth } from "../store/useAuth"
import axios from "axios"
import { ConfirmTransferAdmin } from "../components/ConfirmTransferAdmin"

export const ChangeAdministrator = () => {

    const { token } = useAuth()

    const [lookingFor, setLookingFor] = useState("")
    const [activeUsers, setActiveUsers] = useState<User[] | null>(null)
    const [filteredUsers, setFilteredUsers] = useState<User[] | null>(null)

    const columns = [
        {
            "name": "Nombre"
        },
        {
            "name": "Acciones"
        }
    ]

    useEffect(() => {
        const fetchUsers = async () => {
            const responseActiveUsers = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/active`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setActiveUsers(responseActiveUsers.data.users)
        }
        fetchUsers()
    }, [])

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (lookingFor && activeUsers) {
                const filtered = activeUsers.filter((user) =>
                    `${user.name} ${user.lastName}`.toLowerCase().includes(lookingFor.toLowerCase())
                )
                setFilteredUsers(filtered)
            } else {
                setFilteredUsers(activeUsers)
            }
        }, 300)

        return () => clearTimeout(delayDebounceFn)
    }, [lookingFor, activeUsers])

    if (!filteredUsers) return <div className="flex items-center justify-center w-full"><Spinner variant="dots" /></div>

    return (
        <main className="flex flex-col gap-3 w-full">
            <h1 className="text-lg font-semibold">Cambio de administrador</h1>
            <p className="font-light text-sm">¿Necesitas que otra persona se encargue de la administración? Transfiere tu rol de administrador a otro usuario de confianza. Esto le dará control total del sistema y perderás tu acceso como administrador</p>
            <Input value={lookingFor} onChange={(e) => setLookingFor(e.target.value)} size="lg" variant="bordered" startContent={<SearchIcon />} endContent={<MinusIcon lookingFor={lookingFor} setLookingFor={setLookingFor} />} placeholder="Buscar" />
            <div>
                {filteredUsers && filteredUsers.length > 0 ? (
                    <>
                        <div className="grid [grid-template-columns:60%_40%] gap-10 border-y-1 px-4 border-zinc-200">
                            {columns.map((column, index) => (
                                <div key={index} className="flex items-center text-left font-semibold text-sm 2xl:text-base h-14 py-2">
                                    {column.name}
                                </div>
                            ))}
                        </div>

                        {filteredUsers.map((user) => (
                            <div key={user.id} className="grid [grid-template-columns:60%_40%] gap-10 px-4 items-center h-20 md:h-14 py-2 border-b-1 border-zinc-200">
                                <p className="text-sm 2xl:text-base">{user.name} {user.lastName}</p>
                                <ConfirmTransferAdmin id={user.id} />
                            </div>
                        ))}
                    </>
                ) : (
                    <p className="w-full text-center text-sm font-light text-gray-500 py-4">
                        No hay usuarios
                    </p>
                )}
            </div>
        </main>
    )
}