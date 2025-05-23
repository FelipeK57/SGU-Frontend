import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@heroui/react";

interface ConfirmDialogExternalSystemsProps {
    onConfirm: () => void;
}

export const ConfirmDialogExternalSystems = ({ onConfirm }: ConfirmDialogExternalSystemsProps) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <Button className="w-full" color="danger" variant="bordered" onPress={onOpen}>Eliminar</Button>
            <Modal size="sm" className="m-2" placement="auto" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Confirmar eliminación</ModalHeader>
                            <ModalBody>
                                <p className="text-sm">
                                    ¿Estás seguro de que deseas eliminar permanentemente este sistema externo? Esta acción no se puede deshacer.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="default" variant="light" onPress={onClose}>
                                    Cancelar
                                </Button>
                                <Button color="danger" variant="solid" onPress={() => { onConfirm(); onClose(); }}>
                                    Eliminar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
