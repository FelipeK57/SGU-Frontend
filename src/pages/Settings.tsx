import { Button } from "@heroui/react"
import { useEffect, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router"
import { SettingsLinksMobile } from "../components/SettingsLinksMobile"
import { SettingsLinksDesktop } from "../components/SettingsLinksDesktop"

export const Settings = () => {

    const [showLinks, setShowLinks] = useState(true)
    const location = useLocation().pathname
    const navigate = useNavigate();

    useEffect(() => {
        if (location !== "/dashboard/settings") {
            setShowLinks(false)
        }
    }, [location])

    const paths = [
        {
            path: "my-account",
            name: "Mi cuenta"
        },
        {
            path: "work-areas",
            name: "Áreas"
        },
        {
            path: "change-admin",
            name: "Cambio de administrador"
        },
        {
            path: "password",
            name: "Contraseña"
        }
    ]

    return (
        <main className="flex flex-col gap-3 w-full">
            <nav className="flex flex-row justify-between h-6 items-center">
                <h2 className="text-lg font-semibold">Ajustes</h2>
                {
                    !showLinks &&
                    <Button className="block sm:hidden" color="primary" variant="light" onPress={() => {
                        navigate("/dashboard/settings");
                        setShowLinks(true)
                    }}>Volver</Button>
                }
            </nav>
            <section className="sm:grid sm:grid-cols-3 sm:gap-5">
                {
                    (showLinks && (location === "/dashboard/settings")) &&
                    <SettingsLinksMobile setShowLinks={setShowLinks} paths={paths} />
                }
                <SettingsLinksDesktop paths={paths} />
                <div className="sm:col-span-2">
                    <Outlet />
                </div>
            </section>
        </main>
    )
}