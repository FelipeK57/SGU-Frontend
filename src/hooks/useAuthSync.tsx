import { useEffect } from "react";
import { getCookie } from "typescript-cookie";
import { useAuth } from "../store/useAuth";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import { PayloadJWT } from "../pages/Login";

export const useAuthSync = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const token = getCookie("token");

        if (token) {
            try {
                const payload = jwtDecode<PayloadJWT>(token);
                login(token, { email: payload.email, role: payload.role });
                // No redirige si está todo bien
            } catch (e) {
                // Token inválido o corrupto
                navigate("/login");
            }
        } else {
            // No hay token
            navigate("/login");
        }
    }, []);
};
