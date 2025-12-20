import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import api from "@/lib/api";

const AdminLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post("/auth/cms/login", {
                username,
                password,
            });

            if (response.data.success) {
                const { token } = response.data.data;
                localStorage.setItem("admin_token", token);
                toast.success("Đăng nhập thành công");
                navigate("/admin");
            } else {
                toast.error(response.data.message || "Thông tin đăng nhập không chính xác");
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Lỗi đăng nhập";
            toast.error(errorMessage);
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">Đăng nhập Admin</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="text"
                                placeholder="Tên đăng nhập"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Đăng nhập
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminLogin;
