import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
import { useAuthSync } from "../hooks/useAuthSync";
import { Menu } from "../components/Menu";

export const Dashboard = () => {
    useAuthSync();
    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            <Menu />
            <div className="flex-1 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}