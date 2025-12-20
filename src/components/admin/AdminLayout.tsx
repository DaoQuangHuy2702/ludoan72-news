import { Outlet, Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Users, LogOut, LayoutDashboard, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const AdminLayout = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800">
            <div className="flex h-14 items-center border-b px-6 font-semibold">
                Admin Config
            </div>
            <nav className="flex-1 space-y-2 p-4">
                <Link to="/admin">
                    <Button
                        variant={isActive("/admin") ? "default" : "ghost"}
                        className="w-full justify-start"
                    >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                    </Button>
                </Link>
                <Link to="/admin/warriors">
                    <Button
                        variant={isActive("/admin/warriors") ? "default" : "ghost"}
                        className="w-full justify-start"
                    >
                        <Users className="mr-2 h-4 w-4" />
                        Warriors
                    </Button>
                </Link>
            </nav>
            <div className="border-t p-4">
                <Link to="/admin/login">
                    <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </Link>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen w-full bg-gray-100 dark:bg-gray-900">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 flex-col border-r bg-white dark:bg-gray-800 md:flex">
                <SidebarContent />
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full z-50 flex h-14 items-center border-b bg-white dark:bg-gray-800 px-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="mr-2">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
                <span className="font-semibold">Admin Panel</span>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-8 pt-20 md:pt-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
