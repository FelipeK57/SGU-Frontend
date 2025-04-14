import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Route, Routes } from "react-router";
import { useAuth } from "./store/useAuth";
import { Navigate } from "react-router";
import { RecoveryPassword } from "./pages/RecoveryPassword";
import { VerifyCode } from "./pages/VerifyCode";
import { ChangePassword } from "./pages/ChangePassword";

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
        <Route path="users" element={<main className="h-screen"><img src="https://png.pngtree.com/thumb_back/fh260/background/20230521/pngtree-sunflower-full-screen-backdrop-widescreen-photos-image_2684387.jpg"></img></main>} />
        <Route path="external-systems" element={<h1>External Systems</h1>} />
        <Route path="settings" element={<h1>Settings</h1>} />
      </Route>
    </Routes>
  )
};
