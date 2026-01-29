import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, ArrowLeft, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import api, { getMediaUrl } from "@/lib/api";
import { format } from "date-fns";

const ActivitiesList = () => {
    const { type } = useParams<{ type: string }>();
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const typeMap: Record<string, string> = {
        political: "Thông báo chính trị thời sự",
        law: "Tìm hiểu về luật",
        document: "Thông tư, văn bản, quy định"
    };

    const currentTitle = type ? typeMap[type.toLowerCase()] || "Kiến thức" : "Kiến thức";
    const apiType = type?.toUpperCase();

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const response = await api.get('/public/articles', {
                    params: {
                        type: apiType,
                        page: currentPage - 1,
                        size: 9,
                        sort: 'createdAt,desc'
                    }
                });

                if (response.data && response.data.data) {
                    setArticles(response.data.data.content);
                    setTotalPages(response.data.data.totalPages);
                }
            } catch (error) {
                console.error("Failed to fetch articles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
        window.scrollTo(0, 0);
    }, [apiType, currentPage]);

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Back button */}
                    <Link
                        to="/activities"
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group w-fit"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Quay lại trang Kiến thức</span>
                    </Link>

                    <header className="mb-12">
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4 uppercase">
                            {currentTitle}
                        </h1>
                        <div className="w-20 h-1 bg-primary rounded-full" />
                    </header>

                    {loading ? (
                        <div className="py-20 text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            <p className="mt-4 text-muted-foreground">Đang tải bài viết...</p>
                        </div>
                    ) : articles.length > 0 ? (
                        <>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {articles.map((article) => (
                                    <article
                                        key={article.id}
                                        className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-elegant transition-all duration-300 group flex flex-col h-full border border-border/50"
                                    >
                                        <div className="relative h-56 overflow-hidden">
                                            <img
                                                src={getMediaUrl(article.thumbnail)}
                                                alt={article.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-foreground/80 backdrop-blur-sm text-card text-xs font-medium">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {format(new Date(article.createdAt), 'dd/MM/yyyy')}
                                            </div>
                                        </div>

                                        <div className="p-6 flex flex-col flex-1">
                                            {article.category && (
                                                <span
                                                    className="inline-block px-3 py-1 rounded-full text-xs font-medium border mb-4 w-fit"
                                                    style={{
                                                        backgroundColor: `${article.category.colorCode}10`,
                                                        color: article.category.colorCode,
                                                        borderColor: `${article.category.colorCode}30`
                                                    }}
                                                >
                                                    {article.category.name}
                                                </span>
                                            )}

                                            <Link to={`/news/${article.id}`}>
                                                <h3 className="text-lg font-serif font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                                                    {article.title}
                                                </h3>
                                            </Link>

                                            <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1 italic">
                                                {article.excerpt}
                                            </p>

                                            <Link to={`/news/${article.id}`} className="mt-auto">
                                                <Button variant="ghost" className="text-primary hover:text-primary p-0 h-auto hover:bg-transparent group/btn font-semibold">
                                                    Xem chi tiết
                                                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover/btn:translate-x-1 transition-transform" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="mt-12 flex justify-center">
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
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 bg-muted/20 rounded-3xl border-2 border-dashed border-border/50">
                            <div className="bg-background p-5 rounded-full mb-5 shadow-sm border border-border">
                                <FileText className="w-10 h-10 text-muted-foreground opacity-50" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold mb-2">Chưa có bài viết nào</h3>
                            <p className="text-muted-foreground text-center max-w-sm px-6 italic">
                                Hiện tại chuyên mục "{currentTitle}" chưa có nội dung. Vui lòng quay lại sau.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ActivitiesList;
