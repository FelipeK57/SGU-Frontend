import { useParams } from "react-router"
import { ExternalSystemRole, useFetchExternalSystemRoles } from "../store/useExternalSystemRole"
import { useEffect, useState } from "react"
import { addToast, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Form, Input } from "@heroui/react"
import axios from "axios"
import { useAuth } from "../store/useAuth"
import { ThreePoint } from "./WorkAreas"
import { ConfirmDialog } from "../components/ConfirmDialog"
import { ConfirmDialogMobile } from "../components/ConfirmDialogMobile"

const DEFAULT_ROLE_NAME = "Sin rol";

export const ExternalSystemRoles = () => {
  const { id } = useParams()

  const { roles, fetchExternalSystemRoles } = useFetchExternalSystemRoles()
  const { token } = useAuth()
  const [showFormNewRole, setShowFormNewRole] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [roleName, setRoleName] = useState("")
  const [reload, setReload] = useState(false)
  const [roleId, setRoleId] = useState<number | null>(null)
  const [rolesFiltered, setRoleFiltered] = useState<ExternalSystemRole[] | null>(null)

  const [mobileConfirmDialog, setMobileConfirmDialog] = useState(false);

  const openMobileConfirmDialog = () => setMobileConfirmDialog(true);
  const closeMobileConfirmDialog = () => { setMobileConfirmDialog(false); }

  useEffect(() => {
    fetchExternalSystemRoles(Number(id))
  }, [id, reload])

  useEffect(() => {
    if (roles.length > 0) {
      setRoleFiltered(roles.filter(role => role.name !== DEFAULT_ROLE_NAME))
    }
  }, [roles])

  const editRole = async () => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/external-systems-roles/${roleId}`, {
        name: roleName
      })
      if (response.status === 200) {
        setReload(!reload)
        addToast({
          title: "Rol actualizado",
          description: response.data.message,
          color: "success",
          timeout: 5000
        })
        setShowFormNewRole(false)
        setEditMode(false)
        setRoleName("")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const createRole = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (showFormNewRole) {
      setIsLoading(true)
      if (editMode) {
        editRole()
        return;
      }
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/external-systems-roles`,
          {
            name: roleName,
            externalSystemId: id
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
            title: "Rol de sistema externo creado",
            description: response.data.message,
            color: "success",
            timeout: 5000
          })
        }
        setShowFormNewRole(false)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
        setRoleName("")
      }
    } else {
      setShowFormNewRole(true)
    }
  }

  const deleteRole = async (id: number | null) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/external-systems-roles/${id}`)
      if (response.status === 200) {
        setReload(!reload)
        addToast({
          title: "Rol de sistema externo eliminado",
          description: response.data.message,
          color: "success",
          timeout: 5000
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleConfirmDialogMobile = () => {
    deleteRole(roleId)
    setRoleId(null)
  }

  const handleEditRole = (name: string, id: number) => {
    setRoleName(name)
    setRoleId(id)
    setShowFormNewRole(true)
    setEditMode(true)
  }

  const handleCloseForm = () => {
    setRoleName("")
    if (editMode) {
      setEditMode(false)
    }
    setShowFormNewRole(false)
  }

  return <main className="flex flex-col gap-3 w-full xl:max-w-xl 2xl:max-w-2xl mx-auto">
    <h1 className="font-semibold text-lg">
      Gestión de roles
    </h1>
    <p className="text-sm font-light">Aqui podras gestionar los roles del sistema externo</p>
    {
      <Form className="flex flex-col gap-3 w-full" onSubmit={(e) => createRole(e)}>
        {
          showFormNewRole &&
          <Input variant="bordered" value={roleName} onChange={(e) => setRoleName(e.target.value)} isRequired label="Nombre" labelPlacement="outside" placeholder="Ingresa el nombre del rol" />
        }
        <div className="flex flex-row gap-3 w-full">
          {
            showFormNewRole &&
            <Button onPress={() => handleCloseForm()} variant="bordered" color="default" className="font-semibold w-full">
              Cancelar
            </Button>
          }
          {
            editMode ? <Button type="submit" isLoading={isLoading} isDisabled={isLoading} color="primary" className="font-semibold w-full">
              Guardar cambios
            </Button> : <Button type="submit" color="primary" isLoading={isLoading} isDisabled={isLoading} className="font-semibold w-full">
              Crear nuevo
            </Button>
          }
        </div>
      </Form>
    }
    {
      roles.length === 0 ? <p className="grid place-content-center col-span-full w-full h-20 text-center text-sm font-light text-gray-500">
        No hay roles en el sistema externo.
      </p> : <section className="flex flex-col">
        {
          rolesFiltered?.map((role, index) => {
            return <div className={`${index === 0 && "border-t-1"} flex justify-between items-center w-full border-b-1 border-zinc-200 h-14 px-3`} key={role.id}>
              <p>
                {role.name}
              </p>
              <div className="block md:hidden">
                <Dropdown>
                  <DropdownTrigger>
                    <Button aria-label="Opciones" isIconOnly className="rounded-full" color="primary" variant="bordered">
                      <ThreePoint />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Static Actions">
                    <DropdownItem onPress={() => {
                      handleEditRole(role.name, role.id)
                    }} key="new" color="primary" variant="bordered" className="text-primary">Editar</DropdownItem>
                    <DropdownItem onPress={() => {
                      openMobileConfirmDialog()
                      setRoleId(role.id)
                    }} key="delete" variant="bordered" color="danger" className="text-danger">
                      Eliminar
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div className="hidden md:flex md:gap-3">
                <Button onPress={() => {
                  handleEditRole(role.name, role.id)
                }} color="primary" variant="bordered">
                  Editar
                </Button>
                <ConfirmDialog description="¿Estás seguro de que deseas eliminar permanentemente este rol? Esta acción no se puede deshacer." onConfirm={() => deleteRole(role.id)} />
              </div>
            </div>
          })
        }
        <ConfirmDialogMobile description="¿Estás seguro de que deseas eliminar permanentemente esta área? Esta acción no se puede deshacer." isOpen={mobileConfirmDialog} onClose={closeMobileConfirmDialog} onConfirm={() => { handleConfirmDialogMobile() }} />
      </section>
    }
  </main>
}