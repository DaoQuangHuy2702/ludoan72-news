import NewsCard from "./NewsCard";
import { Button } from "./ui/button";

interface Category {
  id: string;
  name: string;
  colorCode: string;
}

interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  views: number;
  image: string;
}

interface NewsGridProps {
  articles: Article[];
  categories?: Category[];
}

const NewsGrid = ({ articles, categories }: NewsGridProps) => {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-primary rounded-full" />
        <h2 className="text-2xl md:text-3xl font-serif font-semibold text-primary">
          Tin tức mới nhất
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} categories={categories} />
        ))}
      </div>

      <div className="text-center mt-10">
        <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-card">
          Xem thêm tin tức
        </Button>
      </div>
    </section>
  );
};

export default NewsGrid;
