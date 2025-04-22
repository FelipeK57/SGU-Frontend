import { Button, Input } from "@heroui/react"

export const UsersManagement = () => {

    // const columns = [
    //     {
    //         "name": "Identificación"
    //     },
    //     {
    //         "name": "Nombre"
    //     },
    //     {
    //         "name": "Correo"
    //     },
    //     {
    //         "name": "Área"
    //     },
    //     {
    //         "name": "Acciones"
    //     }
    // ]

    return <main className="flex flex-col gap-3 w-full max-w-[1040px] mx-auto">
        <h1 className="text-lg font-semibold">
            Usuarios
        </h1>
        <div className="flex flex-col gap-3 justify-between">
            <div className="flex flex-row gap-3">
                {/* <Button>
                    Activos
                </Button>
                <Button>
                    Inactivos
                </Button> */}
            </div>
            <div className="flex gap-3">
                <Input variant="bordered" startContent={<SearchIcon />} placeholder="Buscar" />
                <Button color="primary" className="font-semibold px-6">Crear usuario</Button>
            </div>
        </div>
        <section>

        </section>
    </main>
}

export const SearchIcon = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 opacity-40">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>

}