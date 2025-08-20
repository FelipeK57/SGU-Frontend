import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
import { useAuthSync } from "../hooks/useAuthSync";
import { Menu } from "../components/Menu";
import { useFetchWorkAreas } from "../store/useWorkArea";
import { useEffect } from "react";

export const Dashboard = () => {
    useAuthSync();

    const { fetchWorkAreas } = useFetchWorkAreas();

    useEffect(() => {
        fetchWorkAreas();
    }, []);

    return (
        <div className="h-svh flex flex-col">
            <Navbar />
            <Menu />
            <div className="flex-1 overflow-y-auto py-3 px-4 w-full">
                <Outlet />
            </div>
        </div>
    );
}