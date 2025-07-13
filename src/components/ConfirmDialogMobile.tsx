import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  description: string
}

export const ConfirmDialogMobile = ({ onConfirm, isOpen, onClose, description }: ConfirmDialogProps) => {
  return (
    <Modal size="sm" className="m-2" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Confirmar eliminación</ModalHeader>
        <ModalBody>
          <p>
            {description}
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
      </ModalContent>
    </Modal>
  );
}
