import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    Button,
    useDisclosure,
    DrawerFooter,
} from "@heroui/react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../store/useAuth";
import { useWindowWidth } from "../hooks/useWidth";

export const Menu = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const { logout } = useAuth();
    const navigate = useNavigate();
    const width = useWindowWidth();
    let settingsRoute = "settings"

    if (width >= 640) {
        settingsRoute = "settings/my-account"
    }

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
            path: settingsRoute,
            name: "Ajustes",
        }
    ]

    const isActive = (route: string) => {
        
        const location = useLocation();
        if (location.pathname.includes(route.slice(0, 6))) {
            return "bg-primary bg-opacity-5 text-primary";
        } else {
            return "text-zinc-500 hover:text-primary";
        }
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    }

    return (
        <>
            <div className="flex items-center justify-between py-2 px-4 h-16 w-full border-b-1 border-b-zinc-200 bg-zinc-50 xl:hidden">
                <img src="/Logo.png" className="h-8 w-40 md:w-fit" alt="Logo de SEMCON" />
                <Button size="lg" color="primary" variant="bordered" onPress={onOpen}>Menú</Button>
            </div>
            <Drawer size="sm" className="rounded-sm" placement="right" isOpen={isOpen} onOpenChange={onOpenChange}>
                <DrawerContent>
                    <DrawerHeader className="flex flex-col gap-2">
                        <h1 className="text-2xl font-semibold">Menú</h1>
                    </DrawerHeader>
                    <DrawerBody className="flex flex-col gap-6 border-t-1 border-zinc-200">
                        {
                            routes.map((route) => {
                                return (
                                    <Link key={route.path} to={route.path} onClick={() => onOpenChange()} className={`flex flex-row justify-between w-full p-3 rounded-xl hover:bg-primary hover:bg-opacity-5 transition-all ${isActive(route.path)}`}>
                                        <p>{route.name}</p>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                        </svg>

                                    </Link>
                                )
                            })
                        }
                    </DrawerBody>
                    <DrawerFooter className="flex justify-start">
                        <Button variant="light" color="danger" onPress={() => handleLogout()}>
                            Cerrar sesión
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
}
