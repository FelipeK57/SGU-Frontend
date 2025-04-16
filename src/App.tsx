import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Route, Routes } from "react-router";
import { useAuth } from "./store/useAuth";
import { Navigate } from "react-router";
import { RecoveryPassword } from "./pages/RecoveryPassword";
import { VerifyCode } from "./pages/VerifyCode";
import { ChangePassword } from "./pages/ChangePassword";
import { Settings } from "./pages/Settings";
import { MyAccount } from "./pages/MyAccount";
import { WorkAreas } from "./pages/WorkAreas";

export const App = () => {

  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      {/* Root */}
      <Route path="/" element={
        isLoggedIn ? <Navigate to="/login" replace /> : <Navigate to="/dashboard/users" replace />
      }
      />
      {/* Login */}
      <Route path="/login" element={<Login />} />

      <Route path="/recovery-password" element={<RecoveryPassword />} />
      <Route path="/recovery-password/verify-code" element={<VerifyCode />} />
      <Route path="/recovery-password/new-password" element={<ChangePassword />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="users" element={<h1>Users</h1>} />
        <Route path="external-systems" element={<h1>External Systems</h1>} />
        <Route path="settings" element={<Settings />}>
          <Route path="my-account" element={<MyAccount />} />
          <Route path="work-areas" element={<WorkAreas />} />
          <Route path="change-admin" element={<h1>change admin</h1>} />
          <Route path="password" element={<h1>password</h1>} />
        </Route>
      </Route>
    </Routes>
  )
};
