import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Shield, Briefcase, Calendar, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

interface Warrior {
    id: string;
    name: string;
    rank: string;
    unit: string;
    status: string;
    joinDate?: string;
    createdAt?: string;
}

const WarriorDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [warrior, setWarrior] = useState<Warrior | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWarrior = async () => {
            try {
                const response = await api.get(`/cms/warriors/${id}`);
                if (response.data && response.data.success) {
                    setWarrior(response.data.data);
                } else {
                    toast.error("Không tìm thấy thông tin chiến sĩ");
                }
            } catch (error) {
                console.error("Failed to fetch warrior:", error);
                toast.error("Lỗi khi tải thông tin chiến sĩ");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchWarrior();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!warrior) {
        return (
            <div className="flex flex-col items-center justify-center p-12">
                <h2 className="text-xl font-bold mb-4">Không tìm thấy thông tin chiến sĩ</h2>
                <Button onClick={() => navigate("/admin/warriors")}>Quay lại danh sách</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
                <Link to="/admin/warriors">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h2 className="text-3xl font-bold tracking-tight">Hồ sơ chiến sĩ</h2>
            </div>

            <Card className="w-full">
                <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b">
                    <div className="flex items-center space-x-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <User className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">{warrior.name}</CardTitle>
                            {/* <p className="text-muted-foreground">{warrior.id}</p> */}
                        </div>
                        <div className="ml-auto">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${warrior.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {warrior.status === 'active' ? 'Đang công tác' : 'Đã nghỉ/Chuyển'}
                            </span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm text-muted-foreground">Cấp bậc</p>
                                    <p className="text-lg">{warrior.rank}</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm text-muted-foreground">Đơn vị</p>
                                    <p className="text-lg">{warrior.unit}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Join date removed as per request */}
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t flex justify-end space-x-3">
                        <Link to={`/admin/warriors/${warrior.id}`}>
                            <Button>Chỉnh sửa thông tin</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default WarriorDetail;
