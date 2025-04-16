import { Button, Form, Input } from "@heroui/react"
import { useState } from "react"

export const WorkAreas = () => {
    const [showNewWorkAreaForm, setShowNewWorkAreaForm] = useState(false);

    const createNewWorkArea = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const name = document.getElementById("name") as HTMLInputElement

        if (showNewWorkAreaForm) {
            console.log("Area creada", name.value)
            setShowNewWorkAreaForm(false)
        } else {
            setShowNewWorkAreaForm(true)
        }
    }

    return (
        <main className="flex flex-col gap-3 w-full">
            <h1 className="text-lg font-semibold">
                Áreas
            </h1>
            <section className="flex flex-col gap-3">
                <Form onSubmit={(e) => createNewWorkArea(e)}>
                    {
                        showNewWorkAreaForm && (
                            <Input id="name" label="Nombre" labelPlacement="outside" placeholder="Ingresa el nombre" variant="bordered" className="w-full" />

                        )
                    }
                    <Button type="submit" color="primary" className="w-full font-semibold">{showNewWorkAreaForm ? "Crear" : "Crear nueva área"}</Button>
                </Form>
                {

                }
            </section>
        </main>
    )
}