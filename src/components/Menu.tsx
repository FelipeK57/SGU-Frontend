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

export const Menu = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const { logout } = useAuth();
    const navigate = useNavigate();

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
            path: "settings",
            name: "Ajustes",
        }
    ]

    const isActive = (route: string) => {
        const location = useLocation();
        if (location.pathname.includes(route)) {
            return "border-b-2 border-primary text-primary";
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
            <div className="flex items-center justify-end p-2 w-full border-b-1 border-b-zinc-200 bg-zinc-50 xl:hidden">
                <Button variant="bordered" onPress={onOpen}>Abrir menu</Button>
            </div>
            <Drawer className="rounded-sm" placement="right" isOpen={isOpen} onOpenChange={onOpenChange}>
                <DrawerContent>
                    <DrawerHeader className="flex flex-col gap-2">
                        <img src="/Logo_Semcon_2021.png" className="h-fit w-2/4" alt="Logo de SEMCON" />
                        <h1 className="text-2xl font-semibold">Menu</h1>
                    </DrawerHeader>
                    <DrawerBody className="flex flex-col gap-6">
                        {
                            routes.map((route) => {
                                return (
                                    <Link key={route.path} to={route.path} onClick={() => onOpenChange()} className={`flex flex-row justify-between w-full p-2 hover:bg-primary hover:bg-opacity-5 transition-all ${isActive(route.path)}`}>
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
