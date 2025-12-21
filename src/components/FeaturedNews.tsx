import { Calendar, Eye, Clock, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { getMediaUrl } from "@/lib/api";

interface FeaturedNewsProps {
  article: {
    id: number;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    views: number;
    readTime: string;
    image: string;
  };
  categories?: { id: string; name: string; colorCode: string; }[];
}

const FeaturedNews = ({ article, categories }: FeaturedNewsProps) => {
  const categoryInfo = categories?.find(c => c.name === article.category);
  const badgeStyle = categoryInfo?.colorCode ? {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: categoryInfo.colorCode,
    borderColor: `${categoryInfo.colorCode}33`,
    borderWidth: '1px',
    borderStyle: 'solid',
    backdropFilter: 'blur(4px)'
  } : {};

  // Apply a fallback class for static/default color if needed
  const badgeClassName = `absolute top-4 left-4 category-badge ${!categoryInfo?.colorCode ? "bg-primary text-card" : ""}`;

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-primary rounded-full" />
        <h2 className="text-2xl md:text-3xl font-serif font-semibold text-primary">
          Tin nổi bật
        </h2>
      </div>

      <div className="news-card grid md:grid-cols-2 gap-0 overflow-hidden">
        {/* Image */}
        <div className="relative h-64 md:h-auto bg-cream-dark">
          <img
            src={getMediaUrl(article.image)}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <span
            className={badgeClassName}
            style={badgeStyle}
          >
            {article.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1.5">
              <Calendar size={16} />
              {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={16} />
              {article.views.toLocaleString()} lượt xem
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={16} />
              {article.readTime}
            </span>
          </div>

          <Link to={`/news/${article.id}`}>
            <h3 className="text-xl md:text-2xl font-serif font-semibold text-foreground mb-4 hover:text-primary transition-colors cursor-pointer">
              {article.title}
            </h3>
          </Link>

          <p className="text-muted-foreground mb-6 line-clamp-3">
            {article.excerpt}
          </p>

          <Link to={`/news/${article.id}`}>
            <Button className="w-fit group">
              Đọc tiếp
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedNews;
