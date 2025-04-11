import { Button, Input } from "@heroui/react"
import { useState } from "react"
import { Link } from "react-router"

export const RecoveryPassword = () => {

    const [email, setEmail] = useState("")

    const [isLoading, setIsLoading] = useState(false)

    const [errors, setErrors] = useState({})

    const sendCode = async () => {
        try {
            setErrors({})
            setIsLoading(true)
            console.log(email)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="grid grid-rows-[1fr_auto_1fr] min-h-screen ">
            <div></div>
            <section className="flex flex-col h-full gap-5 items-center justify-center max-w-80 md:max-w-96 mx-auto">
                <h1 className="font-semibold text-xl">
                    Recuperar contraseña
                </h1>
                <h3 className="text-sm font-light">Ingresa tu correo electrónico asi te enviaremos un código para continuar con la recuperación</h3>
                <Input value={email} onChange={(e) => { setEmail(e.target.value) }} label="Correo Electrónico" labelPlacement="outside" placeholder="Ingresa tu correo electrónico" variant="bordered" />
                <Button isLoading={isLoading} isDisabled={isLoading} onPress={sendCode} color="primary" className="w-full font-semibold">Enviar código</Button>
            </section>
            <nav className="flex items-end justify-center">
                <Link to={"/login"} className="text-sm font-light pb-6 underline w-full text-center">
                    Volver al inicio de sesión
                </Link>
            </nav>
        </main>
    )
}