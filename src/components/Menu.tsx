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
            return "border-b-3 border-primary text-primary";
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
            <div className="flex items-center p-2 w-full border-b-1 border-b-zinc-200 bg-zinc-50 md:hidden shadow-sm">
                <Button variant="light" onPress={onOpen}>Abrir menu</Button>
            </div>
            <Drawer placement="left" isOpen={isOpen} onOpenChange={onOpenChange}>
                <DrawerContent>
                    <DrawerHeader>Menu</DrawerHeader>
                    <DrawerBody className="flex flex-col gap-6">
                        {
                            routes.map((route) => {
                                return (
                                    <Link key={route.path} to={route.path} onClick={() => onOpenChange()} className={`w-full py-2 ${isActive(route.path)}`}>
                                        {route.name}
                                    </Link>
                                )
                            })
                        }
                    </DrawerBody>
                    <DrawerFooter>
                        <Button variant="light" color="danger" onPress={() => handleLogout()}>
                            Cerrar sesión
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
}
