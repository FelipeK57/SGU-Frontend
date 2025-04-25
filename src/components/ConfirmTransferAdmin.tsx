import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    Form,
    addToast,
} from "@heroui/react";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../store/useAuth";
import { useNavigate } from "react-router";

interface ConfirmTransferAdminProps {
    id: number;
}

export const ConfirmTransferAdmin = ({ id }: ConfirmTransferAdminProps) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [isLoading, setIsLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const { token, user, logout } = useAuth();
    const navigate = useNavigate();

    const confirmTransfer = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const data = Object.fromEntries(new FormData(e.currentTarget));

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/transfer_admin_role`,
                {
                    id: id,
                    email: user?.email,
                    password: data.password,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                addToast
                    ({
                        title: "Transferencia de rol exitosa",
                        description: response.data.message,
                        color: "success",
                        timeout: 3000,
                    });
                navigate("/login")
                logout();
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    addToast({
                        title: "Error de autenticación",
                        description: error.response.data.message,
                        color: "danger",
                        timeout: 3000,
                    });
                }
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Button className="w-1/3" color="primary" variant="bordered" onPress={onOpen}>Elegir</Button>
            <Modal className="m-2" size="sm" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Confirmar transferencia de rol</ModalHeader>
                            <ModalBody>
                                <p className="text-sm">
                                    Ingresa tu contraseña actual para confirmar la transferencia.
                                </p>
                                <Form onSubmit={(e) => confirmTransfer(e)} className="flex flex-col gap-3 w-full">
                                    <Input
                                        variant="bordered"
                                        name="password"
                                        isRequired
                                        label="Contraseña"
                                        labelPlacement="outside"
                                        type={passwordVisible ? "text" : "password"}
                                        placeholder="Ingresa tu contraseña"
                                        validate={(value) => {
                                            if (!value) return "El campo no puede estar en blanco";
                                        }}
                                        endContent={
                                            <div className="bg-transparent select-none text-zinc-500 hover:text-zinc-700 transition-colors cursor-pointer text-sm" onClick={() => setPasswordVisible(!passwordVisible)}>
                                                {passwordVisible ?
                                                    "Ocultar"
                                                    : "Mostrar"}
                                            </div>
                                        }
                                    />
                                    <Button
                                        isLoading={isLoading}
                                        disabled={isLoading}
                                        type="submit"
                                        className="w-full bg-primary text-white font-semibold"
                                    >
                                        Continuar
                                    </Button>
                                </Form>
                            </ModalBody>
                            <ModalFooter>
                                <Button onPress={onClose} variant="bordered" color="default" className="font-semibold w-full">
                                    Cancelar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
