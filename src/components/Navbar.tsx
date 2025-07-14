import { Button } from "@heroui/react"
import { useAuth } from "../store/useAuth"
import { Link, useLocation, useNavigate } from "react-router";

export const Navbar = () => {

    const routes = [
        {
            path: "users",
            name: "Usuarios",
        },
        {
            path: "external-systems",
            name: "Sistemas externos",
        },
        {
            path: "settings/my-account",
            name: "Ajustes",
        }
    ]

    const navigate = useNavigate();
    const { logout } = useAuth();

    const isActive = (route: string) => {
        const location = useLocation();
        if (location.pathname.includes(route.slice(0, 6))) {
            return "border-b-3 border-primary text-primary transition-all";
        } else {
            return "text-zinc-500 hover:text-primary transition-all";
        }
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    return (
        <header className="hidden xl:flex flex-row justify-between items-center h-16 px-10 border-b border-zinc-200">
            <img className="w-52 md:w-fit h-4/5" src="/Logo.png" alt="Logo SEMCON" />
            <nav className="flex flex-row items-center h-full">
                {
                    routes.map((route) => {
                        return (
                            <Link key={route.path} className={`flex items-center justify-center w-44 h-full hover:text-primary hover:bg-primary hover:bg-opacity-5 transition-none ${isActive(route.path)}`} to={route.path}>
                                {route.name}
                            </Link>
                        )
                    })
                }
            </nav>
            <Button onPress={() => handleLogout()} variant="light" color="danger">Cerrar sesión</Button>
        </header>
    )
}