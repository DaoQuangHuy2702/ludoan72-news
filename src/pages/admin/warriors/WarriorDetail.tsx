import { useState, useEffect } from "react";
import { format, parseISO, isValid, parse } from "date-fns";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Shield, Briefcase, Calendar, Loader2, Phone, MapPin, StickyNote, Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api, { getMediaUrl } from "@/lib/api";
import { toast } from "sonner";

interface Warrior {
    id: string;
    name: string;
    rank: string;
    unit: string;
    status: string;
    birthDate?: string;
    gender?: string;
    phoneNumber?: string;
    notes?: string;
    strengths?: string;
    aspirations?: string;
    hometownProvinceCode?: string;
    hometownCommuneCode?: string;
    hometownAddress?: string;
    currentProvinceCode?: string;
    currentCommuneCode?: string;
    currentAddress?: string;
    hometownProvinceName?: string;
    hometownCommuneName?: string;
    currentProvinceName?: string;
    currentCommuneName?: string;
    avatar?: string;
    familyMembers?: {
        name: string;
        gender: string;
        birthYear: number;
        occupation: string;
        relationship: string;
    }[];
    createdAt?: string;
}

const WarriorDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [warrior, setWarrior] = useState<Warrior | null>(null);
    const [loading, setLoading] = useState(true);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Chưa cập nhật";
        try {
            // Try ISO first
            let date = parseISO(dateString);
            if (!isValid(date)) {
                // Try dd/MM/yyyy
                date = parse(dateString, "dd/MM/yyyy", new Date());
            }
            if (!isValid(date)) {
                const fallbackDate = new Date(dateString);
                if (!isValid(fallbackDate)) return dateString;
                return format(fallbackDate, "dd/MM/yyyy");
            }
            return format(date, "dd/MM/yyyy");
        } catch (e) {
            return dateString;
        }
    };

    useEffect(() => {
        const fetchWarrior = async () => {
            try {
                const response = await api.get(`/cms/warriors/${id}`);
                if (response.data && response.data.success) {
                    setWarrior(response.data.data);
                } else {
                    toast.error("Không tìm thấy thông tin quân nhân");
                }
            } catch (error) {
                console.error("Failed to fetch warrior:", error);
                toast.error("Lỗi khi tải thông tin quân nhân");
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
                <h2 className="text-xl font-bold mb-4">Không tìm thấy thông tin quân nhân</h2>
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
                <h2 className="text-3xl font-bold tracking-tight">Hồ sơ quân nhân</h2>
            </div>

            <Card className="w-full">
                <CardHeader className="bg-gray-50 dark:bg-gray-800/50 border-b">
                    <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-primary/10 border-2 border-primary/20">
                            {warrior.avatar ? (
                                <img src={getMediaUrl(warrior.avatar)} alt={warrior.name} className="w-full h-full object-cover" />
                            ) : (
                                <User className="h-full w-full p-4 text-primary" />
                            )}
                        </div>
                        <div>
                            <CardTitle className="text-2xl">{warrior.name}</CardTitle>
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
                                    <p className="font-medium text-sm text-muted-foreground">Cấp bậc, chức vụ</p>
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

                            <div className="flex items-start space-x-3">
                                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm text-muted-foreground">Giới tính</p>
                                    <p className="text-lg">{warrior.gender || "Chưa cập nhật"}</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm text-muted-foreground">Số điện thoại</p>
                                    <p className="text-lg">{warrior.phoneNumber || "Chưa cập nhật"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm text-muted-foreground">Ngày sinh</p>
                                    <p className="text-lg">{formatDate(warrior.birthDate)}</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm text-muted-foreground">Quê quán</p>
                                    <p className="text-lg">
                                        {[warrior.hometownAddress, warrior.hometownCommuneName || warrior.hometownCommuneCode, warrior.hometownProvinceName || warrior.hometownProvinceCode]
                                            .filter(Boolean)
                                            .join(", ") || "Chưa cập nhật"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm text-muted-foreground">Nơi ở hiện tại</p>
                                    <p className="text-lg">
                                        {[warrior.currentAddress, warrior.currentCommuneName || warrior.currentCommuneCode, warrior.currentProvinceName || warrior.currentProvinceCode]
                                            .filter(Boolean)
                                            .join(", ") || "Chưa cập nhật"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                            <p className="font-medium text-sm text-muted-foreground mb-1">Sở trường</p>
                            <p className="text-base whitespace-pre-wrap">{warrior.strengths || "Chưa cập nhật"}</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                            <p className="font-medium text-sm text-muted-foreground mb-1">Nguyện vọng</p>
                            <p className="text-base whitespace-pre-wrap">{warrior.aspirations || "Chưa cập nhật"}</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg md:col-span-2">
                            <p className="font-medium text-sm text-muted-foreground mb-1">Ghi chú</p>
                            <p className="text-base whitespace-pre-wrap">{warrior.notes || "Không có ghi chú"}</p>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground border-t pt-4">
                        <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>Ngày tạo hồ sơ: {formatDate(warrior.createdAt)}</span>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t flex justify-end space-x-3">
                        <Link to={`/admin/warriors/${warrior.id}`}>
                            <Button>Chỉnh sửa thông tin</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Family Information */}
            <div className="md:col-span-3">
                <div className="bg-card rounded-xl shadow-sm border p-6">
                    <div className="flex items-center space-x-2 mb-6">
                        <Users className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-bold">Thông tin gia đình</h3>
                    </div>

                    {warrior.familyMembers && warrior.familyMembers.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="font-bold">Họ và tên</TableHead>
                                        <TableHead className="font-bold">Mối quan hệ</TableHead>
                                        <TableHead className="font-bold">Giới tính</TableHead>
                                        <TableHead className="font-bold">Năm sinh</TableHead>
                                        <TableHead className="font-bold">Nghề nghiệp</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {warrior.familyMembers.map((member, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium text-primary">{member.name}</TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {member.relationship}
                                                </span>
                                            </TableCell>
                                            <TableCell>{member.gender}</TableCell>
                                            <TableCell>{member.birthYear}</TableCell>
                                            <TableCell>{member.occupation || "-"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-muted/20 rounded-lg border-2 border-dashed">
                            <User className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                            <p className="text-muted-foreground">Chưa có thông tin về gia đình quân nhân này.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WarriorDetail;
