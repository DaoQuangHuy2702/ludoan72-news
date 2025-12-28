import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo & About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                <span className="text-foreground font-serif font-bold text-lg">72</span>
              </div>
              <div>
                <h3 className="text-lg font-serif font-semibold text-gold">Lữ đoàn 72</h3>
                <p className="text-xs text-card/70">Binh chủng Công binh</p>
              </div>
            </div>
            <p className="text-card/70 text-sm leading-relaxed">
              Đơn vị công binh tinh nhuệ, sẵn sàng chiến đấu, xây dựng và bảo vệ Tổ quốc.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-gold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2 text-sm text-card/70">
              <li><a href="/" className="hover:text-gold transition-colors">Trang chủ</a></li>
              <li><a href="/news" className="hover:text-gold transition-colors">Tin tức</a></li>
              <li><a href="/activities" className="hover:text-gold transition-colors">Kiến thức</a></li>
              <li><a href="/contact" className="hover:text-gold transition-colors">Liên hệ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-semibold text-gold mb-4">Thông tin liên hệ</h4>
            <ul className="space-y-3 text-sm text-card/70">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 shrink-0 text-gold" />
                <span>Lữ đoàn 72 - Binh chủng Công binh</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="shrink-0 text-gold" />
                <span>024.xxxx.xxxx</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="shrink-0 text-gold" />
                <span>contact@ludoan72.vn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-card/10 mt-10 pt-6 text-center text-sm text-card/50">
          © 2024 Lữ đoàn 72 - Binh chủng Công binh. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
