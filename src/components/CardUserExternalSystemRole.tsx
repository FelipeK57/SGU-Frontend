import { Card, CardBody, CardFooter, CardHeader, Select, SelectItem } from "@heroui/react"
import { User } from "../pages/UsersManagement"
import { ExternalSystemRole } from "../store/useExternalSystemRole"

interface CardUserExternalSystemRoleProps {
  user: User
  role: string | null
  workArea: string
  roles: ExternalSystemRole[]
  updateRole: (roleId: number, userId: number) => void
}

export const CardUserExternalSystemRole = ({ user, workArea, role, roles, updateRole }: CardUserExternalSystemRoleProps) => {
  return <Card className="bg-transparent p-2">
    <CardHeader className="font-semibold text-lg">{user.name} {user.lastName}</CardHeader>
    <CardBody className="flex flex-col gap-3 text-sm font-light">
      <p>Área: {workArea}</p>
      <p>Correo: {user.email}</p>
    </CardBody>
    <CardFooter>
      <Select label="Rol" labelPlacement="outside" placeholder="Selecciona un rol" variant="bordered" defaultSelectedKeys={[role || ""]}>
        {
          roles.map((role) => {
            return <SelectItem onPress={() => updateRole(role.id, user.id)} key={role.name}>
              {role.name}
            </SelectItem>
          })
        }
      </Select>
    </CardFooter>
  </Card>
}