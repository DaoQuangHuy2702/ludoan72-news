import { Calendar, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const activities = [
  {
    id: 1,
    title: "Diễn tập chiến đấu phòng thủ cấp Lữ đoàn",
    description: "Lữ đoàn 72 đã tổ chức thành công cuộc diễn tập chiến đấu phòng thủ với quy mô toàn đơn vị, đạt kết quả xuất sắc.",
    date: "15/03/2024",
    category: "Huấn luyện",
    image: "https://images.unsplash.com/photo-1579912437766-7896df6d3cd3?w=800&q=80",
    featured: true,
  },
  {
    id: 2,
    title: "Hội thi Chiến sĩ Công binh giỏi năm 2024",
    description: "Đơn vị tổ chức Hội thi Chiến sĩ Công binh giỏi với sự tham gia của hơn 100 chiến sĩ xuất sắc từ các đơn vị trực thuộc.",
    date: "01/03/2024",
    category: "Thi đua",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80",
  },
  {
    id: 3,
    title: "Chương trình 'Về nguồn' tri ân liệt sĩ",
    description: "Cán bộ chiến sĩ Lữ đoàn 72 đã tổ chức lễ dâng hương, dâng hoa tưởng niệm các anh hùng liệt sĩ tại Nghĩa trang liệt sĩ.",
    date: "27/02/2024",
    category: "Đền ơn đáp nghĩa",
    image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80",
  },
  {
    id: 4,
    title: "Hỗ trợ nhân dân xây dựng nông thôn mới",
    description: "Lữ đoàn 72 đã huy động lực lượng và phương tiện hỗ trợ nhân dân địa phương xây dựng đường giao thông nông thôn.",
    date: "20/02/2024",
    category: "Dân vận",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
  },
  {
    id: 5,
    title: "Huấn luyện kỹ thuật công binh chuyên ngành",
    description: "Đơn vị tổ chức huấn luyện kỹ thuật công binh chuyên ngành cho cán bộ, chiến sĩ các tiểu đoàn trực thuộc.",
    date: "15/02/2024",
    category: "Huấn luyện",
    image: "https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=800&q=80",
  },
  {
    id: 6,
    title: "Tổng kết công tác năm 2023",
    description: "Lữ đoàn 72 tổ chức Hội nghị tổng kết công tác năm 2023 và triển khai nhiệm vụ năm 2024.",
    date: "10/01/2024",
    category: "Sự kiện",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80",
  },
];

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    "Huấn luyện": "bg-primary/10 text-primary border-primary/20",
    "Thi đua": "bg-red-500/10 text-red-600 border-red-500/20",
    "Đền ơn đáp nghĩa": "bg-purple-500/10 text-purple-600 border-purple-500/20",
    "Dân vận": "bg-green-500/10 text-green-600 border-green-500/20",
    "Sự kiện": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  };
  return colors[category] || "bg-secondary text-foreground border-border";
};

const Activities = () => {
  const featuredActivity = activities.find((a) => a.featured);
  const otherActivities = activities.filter((a) => !a.featured);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Hoạt động của đơn vị
          </h1>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6" />
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Cập nhật các hoạt động, sự kiện nổi bật của Lữ đoàn 72 - từ huấn luyện chiến đấu 
            đến công tác dân vận và đền ơn đáp nghĩa
          </p>
        </div>
      </section>

      {/* Featured Activity */}
      {featuredActivity && (
        <section className="pb-12 md:pb-16">
          <div className="container mx-auto px-4">
            <div className="bg-card rounded-2xl overflow-hidden shadow-elegant">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <img
                    src={featuredActivity.image}
                    alt={featuredActivity.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary text-card text-sm">
                    <Calendar className="w-4 h-4" />
                    {featuredActivity.date}
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <span className={`inline-block w-fit px-3 py-1 rounded-full text-sm border mb-4 ${getCategoryColor(featuredActivity.category)}`}>
                    {featuredActivity.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
                    {featuredActivity.title}
                  </h2>
                  <p className="text-muted-foreground mb-6">{featuredActivity.description}</p>
                  <Button className="w-fit">
                    Xem chi tiết
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Activities Grid */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherActivities.map((activity) => (
              <article
                key={activity.id}
                className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-elegant transition-shadow group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-foreground/80 text-card text-xs">
                    <Calendar className="w-3 h-3" />
                    {activity.date}
                  </div>
                </div>
                <div className="p-5">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs border mb-3 ${getCategoryColor(activity.category)}`}>
                    {activity.category}
                  </span>
                  <h3 className="font-serif font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {activity.description}
                  </p>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary p-0 h-auto">
                    Xem chi tiết
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Activities;
