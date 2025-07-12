import { Button, Form, Input } from "@heroui/react"
import axios from "axios"

export const AdminView = () => {

  const createFirstUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {

      const data = Object.fromEntries(new FormData(e.currentTarget))

      console.log("Data:", data)

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/create/admin`,
        {
          name: data.name,
          lastName: data.lastName,
          email: data.email,
          documentType: data.documentType,
          documentNumber: data.documentNumber,
          workAreaName: data.workAreaName
        }
      )

      if (response.status === 201) {
        console.log("Response:", response.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const createFirstArea = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const data = Object.fromEntries(new FormData(e.currentTarget))

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/work-areas`,
        {
          name: data.workArea
        }
      )
      if (response.status === 201) {
        console.log("Response:", response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return <main className="flex flex-col gap-3 p-5 h-screen">
    <h1 className="text-xl font-bold w-full text-center">
      Administrator view
    </h1>
    <section className="grid grid-cols-3 gap-2">
      <article className="flex flex-col gap-3 items-center">
        <h2 className="text-lg font-semibold">
          Admin form create
        </h2>
        <Form onSubmit={(e) => createFirstUser(e)} className="flex flex-col gap-3">
          <Input name="name" variant="bordered" label="Name" labelPlacement="outside" placeholder="Write something" />
          <Input name="lastName" variant="bordered" label="Lastname" labelPlacement="outside" placeholder="Write something" />
          <Input name="email" variant="bordered" label="Email" labelPlacement="outside" placeholder="Write something" />
          <Input name="documentType" variant="bordered" label="Document type" labelPlacement="outside" placeholder="Write something" />
          <Input name="documentNumber" variant="bordered" label="Document number" labelPlacement="outside" placeholder="Write something" />
          <Input name="workAreaName" variant="bordered" label="Work area" labelPlacement="outside" placeholder="Write something" />
          <Button type="submit" color="primary" className="w-full font-semibold">
            Crear
          </Button>
        </Form>
      </article>
      <article className="flex flex-col gap-3 items-center">
        <h2 className="text-lg font-semibold">
          Work area form create
        </h2>
        <Form onSubmit={(e) => createFirstArea(e)}>
          <Input name="workArea" variant="bordered" label="Work Area Name" labelPlacement="outside" placeholder="Write something" />
          <Button type="submit" color="primary" className="w-full font-semibold">
            Crear
          </Button>
        </Form>
      </article>
      <article className="flex flex-col gap-3 items-center">
        <h2 className="text-lg font-semibold">
          Update user role
        </h2>
      </article>
    </section>
  </main>
}