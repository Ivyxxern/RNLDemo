import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar"
import { SidebarProvider } from "../contexts/SidebarContext";
import { HeaderProvider } from "../contexts/HeaderContext";

const LayoutContent = () => {
    return (
        <>
            <AppSidebar />
            <AppHeader />
            <div className="px-4 pt-20 sm:ml-64 sm:px-6">
                <Outlet />
            </div>
        </>
    );
};

const AppLayout = () => {
    return (
        <>
            <HeaderProvider>
                <SidebarProvider>
                    <LayoutContent />
                </SidebarProvider>
            </HeaderProvider>
        </>
    )
}

export default AppLayout