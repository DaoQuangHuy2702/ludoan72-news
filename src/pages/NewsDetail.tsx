import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Calendar, Eye, Clock, ArrowLeft, Share2, Facebook, Twitter, MessageSquare, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { newsArticles, featuredArticle } from "@/data/newsData";
import { Badge } from "@/components/ui/badge";
import api, { getMediaUrl } from "@/lib/api";

interface Category {
    id: string;
    name: string;
    colorCode: string;
}

const NewsDetail = () => {
    const { id, type } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const isActivity = window.location.pathname.startsWith('/activities');

    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories', { params: { size: 100 } });
                if (response.data && response.data.success) {
                    setCategories(response.data.data.content);
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        const fetchArticle = async () => {
            setLoading(true);
            try {
                // Try to find in mock data first for existing static content
                const mockArticle = [...newsArticles, featuredArticle].find(a => a.id.toString() === id);
                if (mockArticle) {
                    setArticle(mockArticle);
                } else {
                    // Fetch from API for dynamic content
                    const response = await api.get(`/cms/articles/${id}`);
                    if (response.data && response.data.data) {
                        const data = response.data.data;
                        setArticle({
                            ...data,
                            image: data.thumbnail, // Map thumbnail to image
                            date: new Date(data.createdAt).toLocaleDateString('vi-VN'),
                            category: data.category?.name
                        });

                        // Increment view count
                        try {
                            await api.put(`/public/articles/${id}/view`);
                        } catch (err) {
                            console.error("Failed to increment view:", err);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch article:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
        fetchArticle();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <div className="flex-grow flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                <Footer />
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <div className="flex-grow container mx-auto px-4 py-20 text-center">
                    <h2 className="text-2xl font-bold mb-4">Không tìm thấy bài viết</h2>
                    <Button onClick={() => navigate(-1)}>Quay lại</Button>
                </div>
                <Footer />
            </div>
        );
    }

    const categoryInfo = categories.find(c => c.name === article.category);
    const badgeStyle = categoryInfo?.colorCode ? {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        color: categoryInfo.colorCode,
        borderColor: `${categoryInfo.colorCode}33`,
        borderWidth: '1px',
        borderStyle: 'solid',
        backdropFilter: 'blur(4px)'
    } : {};

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Breadcrumbs / Back button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Quay lại</span>
                    </button>

                    {/* Article Header */}
                    <header className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            {categoryInfo ? (
                                <span
                                    className="category-badge"
                                    style={{
                                        backgroundColor: `${categoryInfo.colorCode}1a`,
                                        color: categoryInfo.colorCode,
                                        borderColor: `${categoryInfo.colorCode}33`,
                                        borderWidth: '1px',
                                        borderStyle: 'solid'
                                    }}
                                >
                                    {article.category}
                                </span>
                            ) : (
                                <Badge variant="secondary">{article.category}</Badge>
                            )}
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar size={14} />
                                {article.date}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6 leading-tight">
                            {article.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-y py-4">
                            <span className="flex items-center gap-1.5">
                                <Eye size={16} />
                                {article.views.toLocaleString()} lượt xem
                            </span>
                            <div className="flex items-center gap-3 ml-auto">
                                <span className="font-medium">Chia sẻ:</span>
                                <Facebook size={18} className="cursor-pointer hover:text-primary transition-colors" />
                                <Twitter size={18} className="cursor-pointer hover:text-primary transition-colors" />
                                <Share2 size={18} className="cursor-pointer hover:text-primary transition-colors" />
                            </div>
                        </div>
                    </header>

                    {/* Featured Image */}
                    <div className="relative aspect-video mb-10 rounded-2xl overflow-hidden shadow-elegant">
                        <img
                            src={getMediaUrl(article.image)}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Article Content */}
                    <article className="prose prose-lg max-w-none dark:prose-invert">
                        <p className="text-xl text-muted-foreground font-medium mb-8 italic border-l-4 border-primary pl-6">
                            {article.excerpt}
                        </p>

                        <div
                            className="space-y-6 text-foreground leading-relaxed"
                            dangerouslySetInnerHTML={{
                                __html: article.content || "Nội dung đang được cập nhật..."
                            }}
                        />
                    </article>


                    {/* Comment section placeholder */}
                    <section className="mt-16 bg-card rounded-2xl p-8 shadow-sm border">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <MessageSquare size={20} />
                            Bình luận (0)
                        </h3>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0" />
                            <div className="flex-grow">
                                <textarea
                                    placeholder="Viết bình luận của bạn..."
                                    className="w-full bg-background border rounded-lg p-3 focus:ring-1 focus:ring-primary outline-none transition-all h-24"
                                />
                                <Button className="mt-2">Gửi bình luận</Button>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default NewsDetail;
