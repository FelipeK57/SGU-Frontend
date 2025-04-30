import { Button, Card, CardBody, CardFooter, CardHeader } from "@heroui/react"
import { ExternalSystems } from "../pages/ExternalSystemsManagement"
import { useNavigate } from "react-router"
import { ConfirmDialogExternalSystems } from "./ConfirmDialogExternalSystem"

interface CardExternalSystemProps {
    externalSystem: ExternalSystems
    deleteExternalSystem: (id: number) => void
}

export const CardExternalSystem = ({ externalSystem, deleteExternalSystem }: CardExternalSystemProps) => {
    const navigate = useNavigate()

    return <Card className="bg-transparent p-2">
        <CardHeader className="font-semibold text-lg">
            {externalSystem.name}
        </CardHeader>
        <CardBody className="flex flex-col gap-3 text-sm font-light">
            <p>URL: {externalSystem.url}</p>
            <p className="truncate overflow-hidden text-ellipsis whitespace-nowrap">Key: {externalSystem.key}</p>
        </CardBody>
        <CardFooter className="flex flex-row gap-2">
            <Button onPress={() => navigate(`/dashboard/external-systems/${externalSystem.id}`)} color="primary" variant="bordered" className="w-full">
                Administrar roles
            </Button>
            <ConfirmDialogExternalSystems onConfirm={() => deleteExternalSystem(externalSystem.id)} />
        </CardFooter>
    </Card>
}