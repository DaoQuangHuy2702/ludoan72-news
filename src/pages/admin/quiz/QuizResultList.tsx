import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { format } from "date-fns";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

const QuizResultList = () => {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [resultToDelete, setResultToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchResults = async () => {
        try {
            const response = await api.get("/cms/quiz-results", {
                params: {
                    page: currentPage - 1,
                    size: 10
                }
            });
            if (response.data && response.data.data) {
                setResults(response.data.data.content);
                setTotalPages(response.data.data.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch results:", error);
            toast.error("Không thể tải danh sách kết quả.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, [currentPage]);

    const handleDelete = async (id: string) => {
        setResultToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!resultToDelete) return;
        setIsDeleting(true);
        try {
            await api.delete(`/cms/quiz-results/${resultToDelete}`);
            toast.success("Xóa kết quả thành công!");
            fetchResults();
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Có lỗi xảy ra khi xóa kết quả.");
        } finally {
            setIsDeleting(false);
            setDeleteDialogOpen(false);
            setResultToDelete(null);
        }
    };

    if (loading) return <div>Đang tải...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Quản lý kết quả cuộc thi</h2>
            </div>

            <div className="rounded-md border bg-white dark:bg-gray-800">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Họ và tên</TableHead>
                            <TableHead>Cấp bậc</TableHead>
                            <TableHead>Đơn vị</TableHead>
                            <TableHead>Điểm số</TableHead>
                            <TableHead>Thời gian</TableHead>
                            <TableHead>Ngày thi</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {results.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                    Chưa có kết quả nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            results.map((result) => (
                                <TableRow key={result.id}>
                                    <TableCell>
                                        <div className="font-medium">{result.name}</div>
                                        <div className="text-xs text-muted-foreground">{result.phoneNumber}</div>
                                    </TableCell>
                                    <TableCell>{result.rank}</TableCell>
                                    <TableCell>{result.unit}</TableCell>
                                    <TableCell className="font-bold text-primary">{result.score}</TableCell>
                                    <TableCell>{result.completionTime}s</TableCell>
                                    <TableCell>
                                        {result.createdAt ? format(new Date(result.createdAt), "dd/MM/yyyy HH:mm") : "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDelete(result.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 0 && (
                <div className="flex justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        isActive={page === currentPage}
                                        onClick={() => setCurrentPage(page)}
                                        className="cursor-pointer"
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này không thể hoàn tác. Kết quả của thí sinh sẽ bị xóa khỏi hệ thống.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                confirmDelete();
                            }}
                            className="bg-red-500 hover:bg-red-600"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang xóa...
                                </>
                            ) : (
                                "Xác nhận xóa"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default QuizResultList;
