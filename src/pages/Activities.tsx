import { useState, useEffect } from "react";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import api, { getMediaUrl } from "@/lib/api";
import { format } from "date-fns";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  createdAt: string;
  category?: {
    id: string;
    name: string;
    colorCode: string;
  };
}

const Activities = () => {
  const [politicalArticles, setPoliticalArticles] = useState<Article[]>([]);
  const [lawArticles, setLawArticles] = useState<Article[]>([]);
  const [documentArticles, setDocumentArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const [political, law, document] = await Promise.all([
          api.get('/public/articles', { params: { type: 'POLITICAL', size: 6, sort: 'createdAt,desc' } }),
          api.get('/public/articles', { params: { type: 'LAW', size: 6, sort: 'createdAt,desc' } }),
          api.get('/public/articles', { params: { type: 'DOCUMENT', size: 6, sort: 'createdAt,desc' } })
        ]);

        setPoliticalArticles(political.data.data.content || []);
        setLawArticles(law.data.data.content || []);
        setDocumentArticles(document.data.data.content || []);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const ArticleSection = ({ title, articles, type }: { title: string; articles: Article[]; type: string }) => (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif font-bold text-primary">{title}</h2>
        <Link to={`/activities/${type.toLowerCase()}`}>
          <Button variant="ghost" className="text-primary hover:text-primary">
            Xem thêm
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Chưa có bài viết nào
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-elegant transition-shadow group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={getMediaUrl(article.thumbnail)}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-foreground/80 text-card text-xs">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(article.createdAt), 'dd/MM/yyyy')}
                </div>
              </div>
              <div className="p-5">
                {article.category && (
                  <span
                    className="inline-block px-2.5 py-1 rounded-full text-xs border mb-3"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: article.category.colorCode,
                      borderColor: `${article.category.colorCode}33`
                    }}
                  >
                    {article.category.name}
                  </span>
                )}
                <Link to={`/news/${article.id}`}>
                  <h3 className="font-serif font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {article.excerpt}
                </p>
                <Link to={`/news/${article.id}`}>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary p-0 h-auto">
                    Xem chi tiết
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Kiến thức
          </h1>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6" />
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Cập nhật các thông tin, kiến thức quan trọng về chính trị, pháp luật và văn bản quy định
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <ArticleSection
                title="THÔNG BÁO CHÍNH TRỊ THỜI SỰ"
                articles={politicalArticles}
                type="POLITICAL"
              />
              <ArticleSection
                title="TÌM HIỂU VỀ LUẬT"
                articles={lawArticles}
                type="LAW"
              />
              <ArticleSection
                title="THÔNG TƯ, VĂN BẢN, QUY ĐỊNH"
                articles={documentArticles}
                type="DOCUMENT"
              />
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Activities;
