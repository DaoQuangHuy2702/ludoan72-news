import { Sparkles, Calendar, MapPin, Users, Building2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const timelineEvents = [
  { year: "1975", title: "Thành lập Lữ đoàn 72" },
  { year: "1980", title: "Được phong tặng danh hiệu Anh hùng Lực lượng vũ trang" },
  { year: "2000", title: "Hoàn thành xuất sắc nhiệm vụ tại Campuchia" },
  { year: "2020", title: "Đạt danh hiệu Đơn vị Quyết thắng" },
];

const leaders = [
  {
    name: "Đại tá Nguyễn Văn A",
    role: "Chỉ huy trưởng",
    quote: "Xin chào quý vị! Lữ đoàn 72 vinh dự được phục vụ đất nước với tinh thần Công binh anh hùng.",
  },
  {
    name: "Đại tá Trần Văn B",
    role: "Chính ủy",
    quote: "Chúng tôi luôn nêu cao truyền thống 'Đi trước mở đường - Về sau thắng lợi'.",
  },
];

const units = [
  { name: "Ban Chỉ huy Lữ đoàn", desc: "Chỉ huy chung toàn đơn vị", isMain: true },
  { name: "Tiểu đoàn 1", desc: "Công binh chiến đấu" },
  { name: "Tiểu đoàn 2", desc: "Công binh phòng hóa" },
  { name: "Tiểu đoàn 3", desc: "Công binh xây dựng" },
  { name: "Đại đội Trinh sát", desc: "Trinh sát công binh" },
  { name: "Đại đội Cơ giới", desc: "Vận tải và cơ giới" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1579912437766-7896df6d3cd3?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        
        <div className="relative z-10 text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/20 backdrop-blur-sm border border-border/50 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">Lực lượng tinh nhuệ</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary mb-4">
            LỮ ĐOÀN 72
          </h1>
          
          <p className="text-xl md:text-2xl text-primary font-medium mb-6">
            Binh chủng Công binh
          </p>
          
          <p className="max-w-2xl mx-auto text-muted-foreground leading-relaxed">
            Đơn vị anh hùng với truyền thống vẻ vang, luôn hoàn thành xuất sắc nhiệm vụ được giao, 
            góp phần xây dựng và bảo vệ Tổ quốc Việt Nam xã hội chủ nghĩa.
          </p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              Lịch sử hình thành
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
          </div>

          <div className="max-w-3xl mx-auto mb-12">
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-elegant">
              <p className="text-foreground leading-relaxed mb-4">
                Lữ đoàn 72 - Binh chủng Công binh được thành lập vào năm 1975, ngay sau ngày đất nước thống nhất. 
                Từ những ngày đầu thành lập, đơn vị đã nhanh chóng khẳng định vị thế là một trong những lực lượng 
                công binh tinh nhuệ của Quân đội Nhân dân Việt Nam.
              </p>
              <p className="text-foreground leading-relaxed">
                Trải qua gần 5 thập kỷ xây dựng và trưởng thành, Lữ đoàn 72 đã không ngừng phát triển về mọi mặt, 
                từ tổ chức biên chế, trang bị vũ khí, đến năng lực chiến đấu và phong cách làm việc. 
                Đơn vị đã vinh dự được Đảng và Nhà nước trao tặng nhiều phần thưởng cao quý.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {timelineEvents.map((event) => (
              <div key={event.year} className="bg-card rounded-xl p-4 shadow-sm hover:shadow-elegant transition-shadow">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-3 mx-auto">
                  <Calendar className="w-5 h-5 text-card" />
                </div>
                <p className="text-2xl font-serif font-bold text-primary text-center mb-1">{event.year}</p>
                <p className="text-sm text-muted-foreground text-center">{event.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              Địa bàn đóng quân
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-elegant">
              <img
                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80"
                alt="Đại hội Đại biểu Đảng bộ Lữ đoàn"
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-serif font-semibold text-foreground">Cơ sở hiện đại</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Lữ đoàn 72 đóng quân tại khu vực có vị trí chiến lược quan trọng, với cơ sở vật chất hiện đại, 
                đầy đủ tiện nghi phục vụ huấn luyện và sinh hoạt của cán bộ chiến sĩ.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <span className="text-foreground">Khu vực huấn luyện rộng rãi với đầy đủ trang thiết bị</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <span className="text-foreground">Khu nhà ở và sinh hoạt khang trang, hiện đại</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <span className="text-foreground">Cảnh quan xanh mát, môi trường sống trong lành</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              Ban Chỉ huy Lữ đoàn
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {leaders.map((leader) => (
              <div key={leader.name} className="bg-card rounded-2xl p-6 shadow-elegant">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center">
                    <Users className="w-8 h-8 text-card" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-foreground">{leader.name}</h3>
                    <p className="text-sm text-primary font-medium">{leader.role}</p>
                  </div>
                </div>
                <blockquote className="text-muted-foreground italic border-l-4 border-primary pl-4">
                  "{leader.quote}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organization Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              Tổ chức biên chế
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Main command */}
            <div className="flex justify-center mb-8">
              <div className="bg-primary text-card rounded-xl p-4 shadow-elegant">
                <div className="flex items-center gap-3">
                  <Building2 className="w-6 h-6" />
                  <div>
                    <h3 className="font-serif font-semibold">{units[0].name}</h3>
                    <p className="text-sm opacity-90">{units[0].desc}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subordinate units */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {units.slice(1).map((unit) => (
                <div key={unit.name} className="bg-card rounded-xl p-4 shadow-sm hover:shadow-elegant transition-shadow text-center">
                  <h4 className="font-serif font-semibold text-foreground text-sm mb-1">{unit.name}</h4>
                  <p className="text-xs text-muted-foreground">{unit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
