import { useEffect, useState } from "react";
import { useAuth } from "../store/useAuth";
import { useNavigate, useLocation } from "react-router";
import { jwtDecode } from "jwt-decode";
import { PayloadJWT } from "../pages/Login";

export const useAuthSync = () => {
    const { token, setUser, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const syncAuth = async () => {
            if (location.pathname === "/login") return;

            if (!token) {
                logout();
                navigate("/login", { replace: true });
                return;
            }

            try {
                const payload = jwtDecode<PayloadJWT>(token);
                setUser(payload.email, payload.role);
            } catch (error) {
                logout();
                navigate("/login", { replace: true });
            } finally {
                setLoading(false);
            }
        };

        syncAuth();
    }, [token, navigate, location.pathname, logout, setUser]);

    if (loading) {
        return null;
    }

    return null;
};
