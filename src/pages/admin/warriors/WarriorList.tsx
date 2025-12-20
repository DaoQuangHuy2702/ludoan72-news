import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye, Search, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Warrior } from "@/lib/mock-data";
import { toast } from "sonner";

const WarriorList = () => {
    const [warriors, setWarriors] = useState<Warrior[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [rankFilter, setRankFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    const fetchWarriors = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (searchTerm) params.name = searchTerm;
            if (rankFilter !== "all") params.rank = rankFilter;
            if (statusFilter !== "all") params.status = statusFilter;

            const response = await api.get('/cms/warriors', { params });
            if (response.data && response.data.success) {
                setWarriors(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch warriors:", error);
            toast.error("Không thể tải danh sách chiến sĩ");
        } finally {
            setLoading(false);
        }
    }, [searchTerm, rankFilter, statusFilter]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchWarriors();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [fetchWarriors]);

    const handleClearFilters = () => {
        setSearchTerm("");
        setRankFilter("all");
        setStatusFilter("all");
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/cms/warriors/${id}`);
            setWarriors(warriors.filter((w) => w.id !== id));
            toast.success("Xoá chiến sĩ thành công");
        } catch (error) {
            console.error("Failed to delete warrior:", error);
            toast.error("Xoá thất bại");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Chiến sĩ</h2>
                <Link to="/admin/warriors/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Thêm chiến sĩ
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm theo tên..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <Select value={rankFilter} onValueChange={setRankFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Cấp bậc" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả cấp bậc</SelectItem>
                            <SelectItem value="Binh nhì">Binh nhì</SelectItem>
                            <SelectItem value="Binh nhất">Binh nhất</SelectItem>
                            <SelectItem value="Hạ sĩ">Hạ sĩ</SelectItem>
                            <SelectItem value="Trung sĩ">Trung sĩ</SelectItem>
                            <SelectItem value="Thượng sĩ">Thượng sĩ</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem value="active">Đang công tác</SelectItem>
                            <SelectItem value="inactive">Đã nghỉ/Chuyển</SelectItem>
                        </SelectContent>
                    </Select>

                    {(searchTerm || rankFilter !== "all" || statusFilter !== "all") && (
                        <Button variant="ghost" onClick={handleClearFilters} className="text-muted-foreground">
                            <XCircle className="mr-2 h-4 w-4" /> Xoá lọc
                        </Button>
                    )}
                </div>
            </div>

            <div className="rounded-md border bg-white dark:bg-gray-800 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tên</TableHead>
                            <TableHead>Cấp bậc</TableHead>
                            <TableHead>Đơn vị</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    Đang tải dữ liệu...
                                </TableCell>
                            </TableRow>
                        ) : warriors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    Không tìm thấy chiến sĩ nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            warriors.map((warrior) => (
                                <TableRow key={warrior.id}>
                                    <TableCell className="font-medium">{warrior.name}</TableCell>
                                    <TableCell>{warrior.rank}</TableCell>
                                    <TableCell>{warrior.unit}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${warrior.status === "active"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {warrior.status === "active" ? "Đang công tác" : "Đã nghỉ/Chuyển"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Link to={`/admin/warriors/${warrior.id}/detail`}>
                                                <Button variant="ghost" size="icon" title="View">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link to={`/admin/warriors/${warrior.id}`}>
                                                <Button variant="ghost" size="icon" title="Edit">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" title="Delete">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Xác nhận xoá?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Hành động này không thể hoàn tác. Chiến sĩ này sẽ bị xoá khỏi hệ thống.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Huỷ</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(String(warrior.id))} className="bg-red-600 hover:bg-red-700">
                                                            Xoá
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default WarriorList;
