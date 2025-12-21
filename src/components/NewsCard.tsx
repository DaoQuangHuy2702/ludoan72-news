import { Calendar, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { getMediaUrl } from "@/lib/api";

interface NewsCardProps {
  article: {
    id: number;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    views: number;
    image: string;
  };
  categories?: { id: string; name: string; colorCode: string; }[];
}

const NewsCard = ({ article, categories }: NewsCardProps) => {
  const categoryInfo = categories?.find(c => c.name === article.category);

  const badgeStyle = categoryInfo?.colorCode ? {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: categoryInfo.colorCode,
    borderColor: `${categoryInfo.colorCode}33`,
    borderWidth: '1px',
    borderStyle: 'solid',
    backdropFilter: 'blur(4px)'
  } : {};

  const categoryColors: Record<string, string> = {
    "Huấn luyện": "bg-blue-100 text-blue-700",
    "Thi đua": "bg-orange-100 text-orange-700",
    "Dân vận": "bg-green-100 text-green-700",
    "Sự kiện": "bg-purple-100 text-purple-700",
    "Đền ơn đáp nghĩa": "bg-pink-100 text-pink-700",
    "Thể thao": "bg-teal-100 text-teal-700",
    "Chính trị": "bg-red-100 text-red-700",
  };

  return (
    <article className="news-card animate-fade-in" style={{ animationDelay: `${article.id * 100}ms` }}>
      {/* Image */}
      <div className="relative h-48 bg-cream-dark overflow-hidden">
        <img
          src={getMediaUrl(article.image)}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <span
          className={`absolute top-3 left-3 category-badge ${!categoryInfo?.colorCode ? (categoryColors[article.category] || "bg-secondary text-secondary-foreground") : ""}`}
          style={badgeStyle}
        >
          {article.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {article.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye size={14} />
            {article.views.toLocaleString()}
          </span>
        </div>

        <Link to={`/news/${article.id}`}>
          <h3 className="text-lg font-serif font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors cursor-pointer">
            {article.title}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {article.excerpt}
        </p>

        <Link to={`/news/${article.id}`} className="text-sm font-medium text-primary hover:text-gold-dark transition-colors">
          Xem chi tiết →
        </Link>
      </div>
    </article>
  );
};

export default NewsCard;
