import { Button, Input } from "@heroui/react"
import { CardUser } from "../components/CardUser"
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/useAuth";
import { useNavigate } from "react-router";
import { RowUser } from "../components/RowUser";

export interface User {
    id: number;
    name: string;
    lastName: string;
    documentType: string;
    documentNumber: string;
    role: string;
    email: string;
    active: boolean;
    workArea: string;
}

export const UsersManagement = () => {

    const { token } = useAuth()

    const [showInactives, setShowInactives] = useState(false)

    const [lookingFor, setLookingFor] = useState("")

    const [reload, setReload] = useState(false)
    const [activeUsers, setActiveUsers] = useState<User[] | null>(null)
    const [inactiveUsers, setInactiveUsers] = useState<User[] | null>(null)
    const [filteredUsers, setFilteredUsers] = useState<User[] | null>(null);

    const navigate = useNavigate()

    useEffect(() => {
        const fetchUsers = async () => {
            const responseInactiveUsers = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/inactive`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const responseActiveUsers = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/active`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setActiveUsers(responseActiveUsers.data.users)
            setInactiveUsers(responseInactiveUsers.data.users)
        }
        fetchUsers()
    }, [reload])

    useEffect(() => {
        if (showInactives) {
            setFilteredUsers(inactiveUsers);
        } else {
            setFilteredUsers(activeUsers);
        }
    }, [activeUsers, inactiveUsers, showInactives]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const listToFilter = showInactives ? inactiveUsers : activeUsers;
            if (!listToFilter) return;

            const result = listToFilter.filter((user) =>
                user.name.toLowerCase().includes(lookingFor.toLowerCase()) ||
                user.lastName.toLowerCase().includes(lookingFor.toLowerCase()) ||
                user.documentNumber.includes(lookingFor) || user.workArea.toLowerCase().includes(lookingFor.toLowerCase())
            );

            setFilteredUsers(result);
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [lookingFor, activeUsers, inactiveUsers, showInactives]);

    const columns = [
        {
            "name": "Identificación"
        },
        {
            "name": "Nombre"
        },
        {
            "name": "Correo"
        },
        {
            "name": "Área"
        },
        {
            "name": "Acciones"
        }
    ]

    return <main className="flex flex-col gap-3 w-full xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto">
        <h1 className="text-lg font-semibold">
            Usuarios
        </h1>
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
            <div className="flex flex-row gap-3">
                <Button color={showInactives ? "default" : "primary"} variant="bordered" className={`py-6 px-4`} onPress={() => { setShowInactives(false) }}>
                    <div className={`${showInactives ? "bg-default" : " bg-primary text-white"} py-2 px-4 rounded-xl`}>
                        {
                            activeUsers ? activeUsers.length : 0
                        }
                    </div>
                    Activos
                </Button>
                <Button color={!showInactives ? "default" : "primary"} variant="bordered" className={`py-6 px-4`} onPress={() => { setShowInactives(true) }}>
                    <div className={`${!showInactives ? "bg-default" : " bg-primary text-white"} py-2 px-4 rounded-xl`}>
                        {
                            inactiveUsers ? inactiveUsers.length : 0
                        }
                    </div>
                    Inactivos
                </Button>
            </div>
            <div className="flex gap-3">
                <Input value={lookingFor} onChange={(e) => setLookingFor(e.target.value)} size="lg" variant="bordered" startContent={<SearchIcon />} endContent={<MinusIcon lookingFor={lookingFor} setLookingFor={setLookingFor} />} placeholder="Buscar" />
                <Button onPress={() => navigate("/dashboard/new-user")} color="primary" className="font-semibold py-6 px-8">Crear usuario</Button>
            </div>
        </div>
        <section className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:hidden">
            {filteredUsers && filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                    <CardUser key={user.id} user={user} reload={reload} setReload={setReload} />
                ))
            ) : (
                <p className="grid place-content-center col-span-full w-full h-20 text-center text-sm font-light text-gray-500">
                    No hay usuarios {showInactives ? "inactivos" : "activos"}
                </p>
            )}
        </section>
        <div className="hidden xl:block">
            {filteredUsers && filteredUsers.length > 0 ? (
                <>
                    <div className="grid [grid-template-columns:15%_20%_25%_20%_20%] gap-2 border-y-1 px-4 border-zinc-200">
                        {
                            columns.map((column, index) => (
                                <div key={index} className="flex items-center text-left font-semibold text-sm h-14">
                                    {column.name}
                                </div>
                            ))
                        }
                    </div>
                    {filteredUsers.map((user) => (
                        <RowUser key={user.id} user={user} reload={reload} setReload={setReload} />
                    ))
                    }
                </>
            ) : (
                <p className="w-full text-center text-sm font-light text-gray-500 py-4">
                    No hay usuarios {showInactives ? "inactivos" : "activos"}
                </p>
            )}
        </div>
    </main>
}

export const SearchIcon = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 opacity-40">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>

}

interface MinusIconProps {
    lookingFor: string
    setLookingFor: (lookingFor: string) => void
}

export const MinusIcon = ({ lookingFor, setLookingFor }: MinusIconProps) => {

    const handleClear = () => {
        if (!lookingFor) return
        else setLookingFor("")
    }

    if (!lookingFor) return <div className="w-6 h-6" />

    return <svg onClick={() => handleClear()} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 opacity-80 rounded-full text-danger cursor-pointer
    ">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>

}