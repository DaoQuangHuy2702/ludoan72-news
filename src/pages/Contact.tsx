import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Gửi tin nhắn thành công!",
      description: "Chúng tôi sẽ phản hồi trong thời gian sớm nhất.",
    });

    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Liên hệ
          </h1>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6" />
          <p className="text-muted-foreground max-w-xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của quý vị
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-serif font-semibold text-primary mb-6">
                  Thông tin liên hệ
                </h2>
                
                <div className="space-y-5">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Địa chỉ</h3>
                      <p className="text-sm text-muted-foreground">Lữ đoàn 72 - Binh chủng Công binh</p>
                      <p className="text-sm text-muted-foreground">Quân đội Nhân dân Việt Nam</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Điện thoại</h3>
                      <p className="text-sm text-muted-foreground">(024) 1234 5678</p>
                      <p className="text-sm text-muted-foreground">(024) 8765 4321</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Email</h3>
                      <p className="text-sm text-muted-foreground">luudoan72@mod.gov.vn</p>
                      <p className="text-sm text-muted-foreground">congbinh72@mod.gov.vn</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Giờ làm việc</h3>
                      <p className="text-sm text-muted-foreground">Thứ Hai - Thứ Sáu: 7:30 - 11:30, 13:30 - 17:00</p>
                      <p className="text-sm text-muted-foreground">Thứ Bảy: 7:30 - 11:30</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <h3 className="font-serif font-semibold text-primary mb-4">Lưu ý</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Vui lòng liên hệ trước khi đến thăm đơn vị
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Mọi thông tin liên hệ sẽ được bảo mật tuyệt đối
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Thời gian phản hồi: trong vòng 24 giờ làm việc
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card rounded-xl p-6 shadow-sm h-fit">
              <h2 className="text-xl font-serif font-semibold text-primary mb-6">
                Gửi tin nhắn
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Họ và tên *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên của bạn"
                    required
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    required
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0123 456 789"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Tiêu đề *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Tiêu đề tin nhắn"
                    required
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Nội dung *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                    required
                    rows={5}
                    className="mt-1.5 resize-none"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
