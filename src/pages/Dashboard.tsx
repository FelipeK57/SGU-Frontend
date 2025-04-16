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
            <div className="flex-1 overflow-y-auto py-3 px-4 w-full max-w-[1040px] mx-auto">
                <Outlet />
            </div>
        </div>
    );
}