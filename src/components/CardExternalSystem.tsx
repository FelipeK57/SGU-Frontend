import { Button, Card, CardBody, CardFooter, CardHeader } from "@heroui/react"
import { ExternalSystems } from "../pages/ExternalSystemsManagement"
import { useNavigate } from "react-router"
import { ConfirmDialogExternalSystems } from "./ConfirmDialogExternalSystem"

interface CardExternalSystemProps {
    externalSystem: ExternalSystems
}

export const CardExternalSystem = ({ externalSystem }: CardExternalSystemProps) => {

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
            <Button onPress={() => { navigate("/external-systems/roles-management") }} color="primary" variant="bordered" className="w-full">
                Administrar roles
            </Button>
            <ConfirmDialogExternalSystems onConfirm={() => alert("Eliminado")} />
        </CardFooter>
    </Card>
}