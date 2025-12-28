import { useState, useEffect, useCallback } from "react";
import { format, parseISO, isValid, parse } from "date-fns";
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
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";

const WarriorList = () => {
    const [warriors, setWarriors] = useState<Warrior[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const fetchWarriors = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {
                page: page,
                size: pageSize
            };
            if (searchTerm) params.name = searchTerm;

            const response = await api.get('/cms/warriors', { params });
            if (response.data && response.data.success) {
                setWarriors(response.data.data.content);
                setTotalPages(response.data.data.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch warriors:", error);
            toast.error("Không thể tải danh sách quân nhân");
        } finally {
            setLoading(false);
        }
    }, [searchTerm, page, pageSize]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchWarriors();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [fetchWarriors]);

    const handleClearFilters = () => {
        setSearchTerm("");
        setPage(0);
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/cms/warriors/${id}`);
            setWarriors(warriors.filter((w) => w.id !== id));
            toast.success("Xoá quân nhân thành công");
        } catch (error) {
            console.error("Failed to delete warrior:", error);
            toast.error("Xoá thất bại");
        }
    };

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Quân nhân</h2>
                <Link to="/admin/warriors/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Thêm thông tin quân nhân
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full max-w-sm">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm theo tên..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                    {searchTerm && (
                        <Button variant="ghost" onClick={handleClearFilters} className="text-muted-foreground">
                            <XCircle className="mr-2 h-4 w-4" /> Xoá tìm kiếm
                        </Button>
                    )}
                </div>
            </div>

            <div className="rounded-md border bg-white dark:bg-gray-800 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-[150px]">Tên</TableHead>
                            <TableHead>Ngày sinh</TableHead>
                            <TableHead>Giới tính</TableHead>
                            <TableHead>Cấp bậc</TableHead>
                            <TableHead>Nơi ở hiện tại</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    Đang tải dữ liệu...
                                </TableCell>
                            </TableRow>
                        ) : warriors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    Không tìm thấy quân nhân nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            warriors.map((warrior) => (
                                <TableRow key={warrior.id}>
                                    <TableCell className="font-medium">{warrior.name}</TableCell>
                                    <TableCell>{formatDate(warrior.birthDate)}</TableCell>
                                    <TableCell>{warrior.gender || "Nam"}</TableCell>
                                    <TableCell>{warrior.rank}</TableCell>
                                    <TableCell>
                                        {[
                                            warrior.currentAddress,
                                            warrior.currentCommuneName,
                                            warrior.currentProvinceName
                                        ].filter(Boolean).join(", ") || "Chưa cập nhật"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Link to={`/admin/warriors/${warrior.id}/detail`}>
                                                <Button variant="ghost" size="icon" title="Xem chi tiết">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link to={`/admin/warriors/${warrior.id}`}>
                                                <Button variant="ghost" size="icon" title="Chỉnh sửa">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" title="Xoá">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Xác nhận xoá?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Hành động này không thể hoàn tác. Quân nhân này sẽ bị xoá khỏi hệ thống.
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
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <p className="text-sm text-muted-foreground whitespace-nowrap">
                        Hiển thị trang {page + 1} / {totalPages}
                    </p>
                    <Select value={pageSize.toString()} onValueChange={(val) => {
                        setPageSize(parseInt(val));
                        setPage(0);
                    }}>
                        <SelectTrigger className="w-[120px] h-8 text-xs">
                            <SelectValue placeholder="Số hàng" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5 / trang</SelectItem>
                            <SelectItem value="10">10 / trang</SelectItem>
                            <SelectItem value="20">20 / trang</SelectItem>
                            <SelectItem value="50">50 / trang</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Pagination className="mx-0 w-auto">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (page > 0) setPage(page - 1);
                                }}
                                className={page === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setPage(i);
                                    }}
                                    isActive={page === i}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (page < totalPages - 1) setPage(page + 1);
                                }}
                                className={page === totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
};

export default WarriorList;
