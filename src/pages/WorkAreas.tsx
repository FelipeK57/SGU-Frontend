import { addToast, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Form, Input } from "@heroui/react"
import { useEffect, useState } from "react"
import { useFetchWorkAreas } from "../store/useWorkArea";
import axios from "axios";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { ConfirmDialogMobile } from "../components/ConfirmDialogMobile";

export const WorkAreas = () => {
  const [showNewWorkAreaForm, setShowNewWorkAreaForm] = useState(false);

  const [mobileConfirmDialog, setMobileConfirmDialog] = useState(false);

  const openMobileConfirmDialog = () => setMobileConfirmDialog(true);
  const closeMobileConfirmDialog = () => { setMobileConfirmDialog(false); setWorkAreaId(null) }

  const [name, setName] = useState("")
  const [workAreaId, setWorkAreaId] = useState<number | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [disableButton, setDisableButton] = useState(false)
  const [originalWorkAreaName, setOriginalWorkAreaName] = useState("")

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
      setEditMode(false)
      setName("")
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
          setName("")
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

  const deleteWorkArea = async (id: number | null) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/work-areas/${id}`)
      if (response.status === 200) {
        fetchWorkAreas();
        addToast({
          title: "Área eliminada",
          description: response.data.message,
          color: "success",
          timeout: 5000
        })
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 409) {
            addToast({
              title: "Error al eliminar área",
              description: error.response.data.message,
              color: "danger",
              timeout: 5000,
            });
          }
        }
      }
    }
  }

  const handleConfirmDialogMobile = () => {
    deleteWorkArea(workAreaId)
    setWorkAreaId(null)
  }

  const handleCloseMode = () => {
    showNewWorkAreaForm && setShowNewWorkAreaForm(false);
    if (editMode) {
      setEditMode(false);
      setWorkAreaId(null)
      setDisableButton(false)
    }
    setName("")
  }

  useEffect(() => {
    if (editMode) {
      if (originalWorkAreaName !== name) {
        setDisableButton(false)
      } else {
        setDisableButton(true)
      }
    }
  }, [name])

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
                handleCloseMode()
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
          <Button isDisabled={disableButton} type="submit" color="primary" className="w-full font-semibold">
            {
              editMode ? "Confirmar cambio" : "Crear nueva área"
            }
          </Button>
        </Form>
        <div className="flex flex-col w-full gap-0">
          {
            workAreas.map((workArea, index) => {
              return (<div key={workArea.name} className={`${index === 0 && "border-t-1"} flex justify-between items-center w-full border-b-1 border-zinc-200 h-14 px-3`}>
                <p>
                  {workArea.name}
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
                        setEditMode(true)
                        setName(workArea.name)
                        setWorkAreaId(workArea.id)
                        setOriginalWorkAreaName(workArea.name)
                      }} key="new" color="primary" variant="bordered" className="text-primary">Editar</DropdownItem>
                      <DropdownItem onPress={() => {
                        openMobileConfirmDialog()
                        setWorkAreaId(workArea.id)
                      }} key="delete" variant="bordered" color="danger" className="text-danger">
                        Eliminar
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <div className="hidden md:flex md:gap-3">
                  <Button onPress={() => {
                    setEditMode(true)
                    setName(workArea.name)
                    setWorkAreaId(workArea.id)
                    setOriginalWorkAreaName(workArea.name)
                  }} color="primary" variant="bordered">
                    Editar
                  </Button>
                  <ConfirmDialog description="¿Estás seguro de que deseas eliminar permanentemente esta área? Esta acción no se puede deshacer." onConfirm={() => deleteWorkArea(workArea.id)} />
                </div>
              </div>)
            })
          }
        </div>
        <ConfirmDialogMobile description="¿Estás seguro de que deseas eliminar permanentemente esta área? Esta acción no se puede deshacer." isOpen={mobileConfirmDialog} onClose={closeMobileConfirmDialog} onConfirm={() => { handleConfirmDialogMobile() }} />
      </section>
    </main >
  )
}

export const ThreePoint = () => {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
  </svg>
}