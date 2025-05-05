import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useAuth } from "../store/useAuth"
import { User } from "./UsersManagement"
import { addToast, Button, Select, SelectItem, Spinner } from "@heroui/react"
import { CardUserExternalSystemRole } from "../components/CardUserExternalSystemRole"
import { useFetchExternalSystemRoles } from "../store/useExternalSystemRole"

export interface ExternalSystemUser {
  id: number;
  user: User;
  externalRoleName: string | null;
}

export const ExternalSystemUserManagement = () => {

  const externalSystemId = useParams()
  const { token } = useAuth()
  const [externalSystemName, setExternalSystemName] = useState("")
  const [externalSystemUsers, setExternalSystemUsers] = useState<ExternalSystemUser[] | null>(null)
  const [reload, setReload] = useState(false)

  const navigate = useNavigate()

  const { roles, fetchExternalSystemRoles } = useFetchExternalSystemRoles()

  useEffect(() => {
    fetchExternalSystemRoles(Number(externalSystemId.id))
  }, [reload, externalSystemId])

  useEffect(() => {
    if (!externalSystemId) return

    const fetchExternalSystemData = async () => {
      const responseExternalSystemUsers = await axios.get(`${import.meta.env.VITE_API_URL}/api/external-systems/${externalSystemId.id}/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const simplifiedUsers: ExternalSystemUser[] = responseExternalSystemUsers.data.externalSystemUsers.map((item: any) => ({
        id: item.id,
        user: {
          id: item.User.id,
          name: item.User.name,
          lastName: item.User.lastName,
          documentType: item.User.documentType,
          documentNumber: item.User.documentNumber,
          role: item.User.role,
          email: item.User.email,
          active: item.User.active,
          workArea: item.User.workArea.name,
        },
        externalRoleName: item.ExternalSystemRole ? item.ExternalSystemRole.name : "none",
      }));
      setExternalSystemUsers(simplifiedUsers)
      setExternalSystemName(responseExternalSystemUsers.data.externalSystemUsers[0].ExternalSystem.name)
    }
    fetchExternalSystemData()
  }, [externalSystemId])

  const updateRole = async (roleId: number, userId: number) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/external-system-user`,
        {
          externalSystemId: externalSystemId.id,
          userId: userId,
          roleId: roleId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (response.status === 200) {
        setReload(!reload)
        addToast({
          title: "Rol de usuario actualizado",
          description: response.data.message,
          color: "success",
          timeout: 5000
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (!externalSystemUsers) return <div className="flex items-center justify-center w-full"><Spinner variant="dots" /></div>

  return <main className="flex flex-col gap-3 w-full xl:max-w-[1280px] 2xl:max-w-[1440px] mx-auto">
    <div className="flex flex-row justify-between items-center">
      <h1 className="font-semibold text-lg">
        Sistemas Externos
      </h1>
      <Button onPress={() => navigate(`/dashboard/external-systems`)} color="primary" variant="light" className="font-light">
        Atrás
      </Button>
    </div>
    <p className="text-sm font-light">Administra los roles de cada usuario dentro del sistema: <strong className="font-semibold">{externalSystemName}</strong></p>
    <Button variant="bordered" onPress={() => navigate(`/dashboard/external-system-roles/${externalSystemId.id}`)} color="primary" className="font-semibold">
      Gestionar roles
    </Button>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 xl:hidden">
      {
        externalSystemUsers.length > 0 ? (
          <>
            {
              externalSystemUsers.map((externalSystem) => {
                return <CardUserExternalSystemRole key={externalSystem.id} user={externalSystem.user} role={externalSystem.externalRoleName} workArea={externalSystem.user.workArea} roles={roles} updateRole={updateRole} />
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
    <div className="hidden xl:block">
      {
        externalSystemUsers.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-10 border-y-1 px-4 border-zinc-200">
              <div className="flex items-center text-left font-semibold text-sm h-14 py-2">
                Nombre
              </div>
              <div className="hidden md:flex items-center text-left font-semibold text-sm h-14 py-2">
                Área
              </div>
              <div className="flex items-center text-left font-semibold text-sm h-14 py-2">
                Rol
              </div>
            </div>
            {
              externalSystemUsers.map((externalSystem) => {
                return <div key={externalSystem.id} className="grid grid-cols-2 md:grid-cols-3 gap-10 px-4 items-center h-20 md:h-14 py-2 border-b-1 border-zinc-200">
                  <p className="text-sm">{externalSystem.user.name} {externalSystem.user.lastName}</p>
                  <p className="hidden md:flex text-sm">{externalSystem.user.workArea}</p>
                  <Select disallowEmptySelection variant="bordered" defaultSelectedKeys={[externalSystem.externalRoleName || "none"]}>
                    {
                      roles.map((role) => (
                        <SelectItem onPress={() => {
                          updateRole(role.id, externalSystem.user.id)
                        }} key={role.name}>{role.name}</SelectItem>
                      ))
                    }
                  </Select>

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