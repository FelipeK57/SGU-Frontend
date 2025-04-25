import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Route, Routes } from "react-router";
import { useAuth } from "./store/useAuth";
import { Navigate } from "react-router";
import { RecoveryPassword } from "./pages/RecoveryPassword";
import { VerifyCode } from "./pages/VerifyCode";
import { NewPassword } from "./pages/NewPassword";
import { Settings } from "./pages/Settings";
import { MyAccount } from "./pages/MyAccount";
import { WorkAreas } from "./pages/WorkAreas";
import { ChangePassword } from "./pages/ChangePassword";
import { UsersManagement } from "./pages/UsersManagement";
import { NewUser } from "./pages/NewUser";
import { EditUser } from "./pages/EditUser";
import { ChangeAdministrator } from "./pages/ChangeAdministrator";
import { ExternalSystemsManagement } from "./pages/ExternalSystemsManagement";

export const App = () => {

  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      {/* Root */}
      <Route path="/" element={
        isLoggedIn ? <Navigate to="/dashboard/users" replace /> : <Navigate to="/login" replace />
      }
      />
      {/* Login */}
      <Route path="/login" element={<Login />} />

      <Route path="/recovery-password" element={<RecoveryPassword />} />
      <Route path="/recovery-password/verify-code" element={<VerifyCode />} />
      <Route path="/recovery-password/new-password" element={<NewPassword />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="users" element={<UsersManagement />} />
        <Route path="new-user" element={<NewUser />} />
        <Route path="edit-user" element={<EditUser />} />
        <Route path="external-systems" element={<ExternalSystemsManagement />} />
        <Route path="settings" element={<Settings />}>
          <Route path="my-account" element={<MyAccount />} />
          <Route path="work-areas" element={<WorkAreas />} />
          <Route path="change-admin" element={<ChangeAdministrator />} />
          <Route path="password" element={<ChangePassword />} />
        </Route>
      </Route>
    </Routes>
  )
};
