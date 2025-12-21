import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Search, XCircle } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Category {
    id: string;
    name: string;
    colorCode: string;
}

const CategoryList = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {
                page: page,
                size: pageSize
            };
            if (searchTerm) params.name = searchTerm;

            const response = await api.get('/cms/categories', { params });
            if (response.data && response.data.success) {
                setCategories(response.data.data.content);
                setTotalPages(response.data.data.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            toast.error("Không thể tải danh sách danh mục");
        } finally {
            setLoading(false);
        }
    }, [searchTerm, page, pageSize]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchCategories();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [fetchCategories]);

    const handleClearFilters = () => {
        setSearchTerm("");
        setPage(0);
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/cms/categories/${id}`);
            setCategories(categories.filter((c) => c.id !== id));
            toast.success("Xoá danh mục thành công");
        } catch (error) {
            console.error("Failed to delete category:", error);
            toast.error("Xoá thất bại");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Quản lý danh mục bài viết</h2>
                <Link to="/admin/categories/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Thêm danh mục
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

                {searchTerm && (
                    <Button variant="ghost" onClick={handleClearFilters} className="text-muted-foreground">
                        <XCircle className="mr-2 h-4 w-4" /> Xoá lọc
                    </Button>
                )}
            </div>

            <div className="rounded-md border bg-white dark:bg-gray-800 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tên danh mục</TableHead>
                            <TableHead>Mã màu</TableHead>
                            <TableHead>Hiển thị</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Đang tải dữ liệu...
                                </TableCell>
                            </TableRow>
                        ) : categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Không tìm thấy danh mục nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell className="font-medium">{category.name}</TableCell>
                                    <TableCell>
                                        <code className="bg-gray-100 px-2 py-1 rounded">{category.colorCode}</code>
                                    </TableCell>
                                    <TableCell>
                                        <div
                                            className="w-8 h-8 rounded border"
                                            style={{ backgroundColor: category.colorCode }}
                                            title={category.colorCode}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Link to={`/admin/categories/${category.id}`}>
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
                                                            Hành động này không thể hoàn tác. Danh mục này sẽ bị xoá khỏi hệ thống.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Huỷ</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(category.id)} className="bg-red-600 hover:bg-red-700">
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

            {totalPages > 0 && (
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
            )}
        </div>
    );
};

export default CategoryList;
