import { useState, useEffect, useCallback } from "react";
import api, { getMediaUrl } from "@/lib/api";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Search, XCircle, FileText } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

interface Article {
    id: string;
    title: string;
    excerpt: string;
    category: {
        id: string;
        name: string;
        colorCode: string;
    } | null;
    views: number;
    createdAt: string;
    type: "NEWS" | "ACTIVITY";
}

const ArticleList = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const fetchArticles = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {
                page: page,
                size: pageSize
            };
            // The current backend API getAllArticles doesn't support search yet, 
            // but we'll include it for future-proofing or if it works via query params
            if (searchTerm) params.title = searchTerm;

            const response = await api.get('/cms/articles', { params });
            if (response.data && response.data.success) {
                setArticles(response.data.data.content);
                setTotalPages(response.data.data.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch articles:", error);
            toast.error("Không thể tải danh sách bài viết");
        } finally {
            setLoading(false);
        }
    }, [searchTerm, page, pageSize]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchArticles();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [fetchArticles]);

    const handleClearFilters = () => {
        setSearchTerm("");
        setPage(0);
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/cms/articles/${id}`);
            setArticles(articles.filter((a) => a.id !== id));
            toast.success("Xoá bài viết thành công");
        } catch (error) {
            console.error("Failed to delete article:", error);
            toast.error("Xoá thất bại");
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Quản lý bài viết</h2>
                <Link to="/admin/articles/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Viết bài mới
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm theo tiêu đề..."
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
                            <TableHead>Tiêu đề</TableHead>
                            <TableHead>Loại</TableHead>
                            <TableHead>Danh mục</TableHead>
                            <TableHead>Lượt xem</TableHead>
                            <TableHead>Ngày tạo</TableHead>
                            <TableHead className="text-right">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Đang tải dữ liệu...
                                </TableCell>
                            </TableRow>
                        ) : articles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Không tìm thấy bài viết nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            articles.map((article) => (
                                <TableRow key={article.id}>
                                    <TableCell className="font-medium max-w-[300px] truncate">
                                        {article.title}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={article.type === "NEWS" ? "secondary" : "outline"} className={article.type === "ACTIVITY" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}>
                                            {article.type === "NEWS" ? "Tin tức" : "Hoạt động"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {article.category ? (
                                            <Badge
                                                style={{
                                                    backgroundColor: `${article.category.colorCode}1a`,
                                                    color: article.category.colorCode,
                                                    border: `1px solid ${article.category.colorCode}33`
                                                }}
                                                variant="outline"
                                            >
                                                {article.category.name}
                                            </Badge>
                                        ) : (
                                            <span className="text-muted-foreground text-xs italic">Không có</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{article.views.toLocaleString()}</TableCell>
                                    <TableCell>{formatDate(article.createdAt)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                            <Link to={`/admin/articles/${article.id}`}>
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
                                                        <AlertDialogTitle>Xác nhận xoá bài viết?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Hành động này không thể hoàn tác. Bài viết "{article.title}" sẽ bị xoá vĩnh viễn.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Huỷ</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(article.id)} className="bg-red-600 hover:bg-red-700">
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

                            {/* Simple pagination logic for demonstration */}
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
                            )).slice(Math.max(0, page - 2), Math.min(totalPages, page + 3))}

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

export default ArticleList;
