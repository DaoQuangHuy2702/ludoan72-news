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
import { PlusCircle, Edit, Trash2, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { Link } from "react-router-dom";
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

const QuizList = () => {
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [quizToDelete, setQuizToDelete] = useState<string | null>(null);

    const fetchQuizzes = async () => {
        try {
            const response = await api.get("/cms/quizzes", {
                params: {
                    page: currentPage - 1,
                    size: 10
                }
            });
            if (response.data && response.data.data) {
                setQuizzes(response.data.data.content);
                setTotalPages(response.data.data.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch quizzes:", error);
            toast.error("Không thể tải danh sách bộ câu hỏi.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, [currentPage]);

    const handleDelete = async () => {
        if (!quizToDelete) return;

        try {
            await api.delete(`/cms/quizzes/${quizToDelete}`);
            toast.success("Xóa thành công!");
            fetchQuizzes();
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Xóa thất bại.");
        } finally {
            setIsDeleteDialogOpen(false);
            setQuizToDelete(null);
        }
    };

    const confirmDelete = (id: string) => {
        setQuizToDelete(id);
        setIsDeleteDialogOpen(true);
    };

    const handleSetActive = async (id: string) => {
        try {
            await api.post(`/cms/quizzes/${id}/active`);
            toast.success("Đã kích hoạt bộ câu hỏi!");
            fetchQuizzes();
        } catch (error: any) {
            console.error("Set active failed:", error);
            const message = error.response?.data?.message || "Kích hoạt thất bại.";
            toast.error(message);
        }
    };

    const handleDeactivate = async (id: string) => {
        try {
            await api.post(`/cms/quizzes/${id}/deactivate`);
            toast.success("Đã hủy kích hoạt bộ câu hỏi!");
            fetchQuizzes();
        } catch (error: any) {
            console.error("Deactivate failed:", error);
            const message = error.response?.data?.message || "Hủy kích hoạt thất bại.";
            toast.error(message);
        }
    };

    if (loading) return <div className="p-8 text-center italic">Đang tải...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Quản lý bộ câu hỏi</h2>
                <Link to="/admin/quizzes/new">
                    <Button className="gap-2">
                        <PlusCircle className="w-4 h-4" />
                        Tạo bộ câu hỏi mới
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border bg-white dark:bg-gray-800">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tiêu đề</TableHead>
                            <TableHead>Mô tả</TableHead>
                            <TableHead className="text-center">Trạng thái</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {quizzes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                                    Chưa có bộ câu hỏi nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            quizzes.map((quiz) => (
                                <TableRow key={quiz.id}>
                                    <TableCell className="font-medium max-w-[300px] truncate">
                                        {quiz.title}
                                    </TableCell>
                                    <TableCell className="max-w-[400px] truncate text-muted-foreground">
                                        {quiz.description || "-"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {quiz.isActive ? (
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Đang hoạt động
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-[10px] h-6 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDeactivate(quiz.id)}
                                                >
                                                    Bỏ kích hoạt
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-xs h-7 gap-1 text-muted-foreground hover:text-primary"
                                                onClick={() => handleSetActive(quiz.id)}
                                            >
                                                <Circle className="w-3 h-3" />
                                                Kích hoạt
                                            </Button>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link to={quiz.isActive ? "#" : `/admin/quizzes/${quiz.id}`} className={quiz.isActive ? "cursor-not-allowed" : ""}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={quiz.isActive}
                                                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 disabled:opacity-30"
                                                    title={quiz.isActive ? "Không thể sửa bộ câu hỏi đang hoạt động" : "Chỉnh sửa"}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                disabled={quiz.isActive}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-30"
                                                onClick={() => confirmDelete(quiz.id)}
                                                title={quiz.isActive ? "Không thể xóa bộ câu hỏi đang hoạt động" : "Xóa"}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
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

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn xóa bộ câu hỏi này?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này không thể hoàn tác. Bộ câu hỏi sẽ bị xóa khỏi hệ thống.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
                        >
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default QuizList;
