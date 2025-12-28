import { useState } from "react";
import { Trophy, RotateCcw, CheckCircle, XCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import api from "@/lib/api";

const quizQuestions = [
  {
    question: "Ngày truyền thống của Binh chủng Công binh là ngày nào?",
    options: ["25/12/1944", "25/03/1946", "22/12/1944", "19/05/1945"],
    correctAnswer: 1,
  },
  {
    question: "Tổ chức tiền thân của Binh chủng Công binh là gì?",
    options: ["Cục Quân giới", "Công chính Giao thông Cục", "Cục Tác chiến", "Cục Vận tải"],
    correctAnswer: 1,
  },
  {
    question: "Khẩu hiệu truyền thống vẻ vang của Binh chủng Công binh là gì?",
    options: ["Quyết chiến - Quyết thắng", "Thần tốc - Táo bạo", "Mở đường thắng lợi", "Trung thành - Dũng cảm"],
    correctAnswer: 2,
  },
  {
    question: "Bác Hồ ví lực lượng Công binh với bộ phận nào của cây mác trong thư gửi cán bộ chiến sĩ?",
    options: ["Mũi mác", "Lưỡi mác", "Cán mác", "Vỏ mác"],
    correctAnswer: 2,
  },
  {
    question: "Ai là Tư lệnh đầu tiên của Binh chủng Công binh?",
    options: ["Phạm Hoàng", "Trần Đại Nghĩa", "Võ Nguyên Giáp", "Hoàng Văn Thái"],
    correctAnswer: 0,
  },
  {
    question: "Kỳ tích nào được thực hiện tại Đồi A1 trong chiến dịch Điện Biên Phủ bởi bộ đội Công binh?",
    options: ["Bắc cầu qua sông Nậm Rốm", "Kích nổ khối bộc phá gần 1000kg", "Đào hào bao vây sân bay Mường Thanh", "Rà phá hết bãi mìn của Pháp"],
    correctAnswer: 1,
  },
  {
    question: "Binh chủng Công binh đón nhận danh hiệu Anh hùng LLVTND lần thứ nhất vào năm nào?",
    options: ["1975", "1976", "1980", "1985"],
    correctAnswer: 1,
  },
  {
    question: "Công trình trên biển nào là biểu tượng ý chí kiên cường của bộ đội Công binh?",
    options: ["Cảng Cam Ranh", "Đường Hồ Chí Minh trên biển", "Hệ thống Nhà giàn DK1", "Đèn hải đăng Trường Sa"],
    correctAnswer: 2,
  },
  {
    question: "BOMICEN là tên viết tắt của cơ quan nào trực thuộc Binh chủng?",
    options: ["Trung tâm Công nghệ xử lý Bom mìn", "Viện Kỹ thuật Công binh", "Trường Sĩ quan Công binh", "Trung tâm Thông tin Công binh"],
    correctAnswer: 0,
  },
  {
    question: "Năm đầu tiên Binh chủng cử Đội Công binh tham gia Gìn giữ hòa bình Liên Hợp Quốc là năm nào?",
    options: ["2020", "2021", "2022", "2023"],
    correctAnswer: 2,
  },
  {
    question: "Khu vực nào là nơi đóng quân của Đội Công binh Việt Nam tại phái bộ UNISFA?",
    options: ["Nam Sudan", "Trung Phi", "Khu vực Abyei", "Mali"],
    correctAnswer: 2,
  },
  {
    question: "Sự kiện cứu hộ quốc tế quy mô lớn nào Công binh tham gia vào đầu năm 2023?",
    options: ["Lũ lụt ở Libya", "Động đất tại Thổ Nhĩ Kỳ", "Cháy rừng ở Hy Lạp", "Sóng thần ở Indonesia"],
    correctAnswer: 1,
  },
  {
    question: "Đơn vị nào trực tiếp bắc cầu phao xử lý sự cố cầu Phong Châu (Phú Thọ) năm 2024?",
    options: ["Lữ đoàn 72", "Lữ đoàn 249", "Lữ đoàn 239", "Lữ đoàn 270"],
    correctAnswer: 1,
  },
  {
    question: "Vũ khí đặc biệt nào do Công binh chế tạo để vô hiệu hóa bom từ trường của Mỹ?",
    options: ["Máy dò mìn cầm tay", "Nam châm vĩnh cửu", "Khung dây nam châm rà phá từ tính", "Xe thiết bị quét mìn"],
    correctAnswer: 2,
  },
  {
    question: "Tuyến đường nào được mệnh danh là 'Trận đồ bát quái' xuyên rừng già do Công binh mở?",
    options: ["Đường 9 Nam Lào", "Đường Hồ Chí Minh (Đường Trường Sơn)", "Đường 1A", "Đường 5"],
    correctAnswer: 1,
  },
  {
    question: "Đến năm 2026, Binh chủng Công binh sẽ kỷ niệm bao nhiêu năm ngày truyền thống?",
    options: ["75 năm", "80 năm", "85 năm", "90 năm"],
    correctAnswer: 1,
  },
  {
    question: "Huân chương cao quý nhất mà Binh chủng Công binh từng được nhận là gì?",
    options: ["Huân chương Độc lập", "Huân chương Quân công", "Huân chương Sao Vàng", "Huân chương Hồ Chí Minh"],
    correctAnswer: 2,
  },
  {
    question: "Đơn vị nào dự kiến đón nhận danh hiệu Anh hùng LLVTND vào tháng 12/2025?",
    options: ["Lữ đoàn 72", "Lữ đoàn 249", "Tiểu đoàn 1", "Trường Sĩ quan Công binh"],
    correctAnswer: 1,
  },
  {
    question: "Câu nói nào đúc kết phương thức hoạt động đầy hy sinh của bộ đội Công binh?",
    options: ["Đi trước mở đường", "Về sau thắng lợi", "Đi trước về sau", "Cả 3 phương án trên"],
    correctAnswer: 2,
  },
  {
    question: "Phương tiện bảo đảm cơ động chủ yếu giúp đại quân tiến vào Sài Gòn xuân 1975 là gì?",
    options: ["Thuyền nan", "Máy bay", "Cơ sở vật chất tại chỗ", "Cơ giới và cầu phao dã chiến"],
    correctAnswer: 3,
  },
  {
    question: "Kết quả xử lý cung đường 'Highway to Hell' tại Abyei của Đội Công binh Việt Nam?",
    options: ["Để nguyên trạng", "Biến thành con đường cấp phối phẳng lì", "Làm cầu treo", "Xây dựng đường bê tông"],
    correctAnswer: 1,
  },
  {
    question: "Tên gọi thân mật biểu hiện sự nguy hiểm của người lính rà phá bom mìn là gì?",
    options: ["Người đi tìm cái chết", "Chiến đấu với tử thần giấu mặt", "Thợ săn bom mìn", "Người lính im lặng"],
    correctAnswer: 1,
  },
  {
    question: "Cuộc giải cứu 'phép màu' nào năm 2014 có sự đóng góp then chốt của Công binh?",
    options: ["Giải cứu thợ mỏ Chile", "Hầm thủy điện Đạ Dâng", "Sập cầu Cần Thơ", "Hang Tham Luang"],
    correctAnswer: 1,
  },
  {
    question: "Khí tài đặc chủng nào giúp Công binh bảo đảm vượt sông nhanh chóng cho xe tăng?",
    options: ["Xuồng máy", "Cầu phao PMP", "Phà gỗ", "Cầu treo"],
    correctAnswer: 1,
  },
  {
    question: "Nhiệm vụ 'xây dựng công trình chiến đấu' của Công binh bao gồm những gì?",
    options: ["Xây nhà văn hóa", "Xây dựng hầm hào, công sự, SHC ngầm", "Làm đường quốc lộ", "Xây dựng trường học"],
    correctAnswer: 1,
  },
  {
    question: "Lực lượng nòng cốt tham gia Trung tâm hành động bom mìn quốc gia (VNMAC) là ai?",
    options: ["Cảnh sát PCCC", "Bộ đội Công binh", "Dân quân tự vệ", "Thanh niên xung phong"],
    correctAnswer: 1,
  },
  {
    question: "Hình ảnh 'người lính cởi trần, khoét núi' gắn liền với giai đoạn nào?",
    options: ["Kháng chiến chống Pháp và Mỹ", "Thời kỳ bao cấp", "Thời kỳ đổi mới", "Năm 2024"],
    correctAnswer: 0,
  },
  {
    question: "Công trình dân sinh lớn nào có sự đóng góp xây dựng quan trọng của Công binh?",
    options: ["Landmark 81", "Thủy điện Hòa Bình và Đường dây 500kV", "Cầu Bãi Cháy", "Sân bay Phú Quốc"],
    correctAnswer: 1,
  },
  {
    question: "Khen thưởng cao nhất cho cá nhân/tập thể công binh có thành tích đặc biệt là gì?",
    options: ["Bằng khen của Bộ", "Danh hiệu Anh hùng Lực lượng vũ trang nhân dân", "Chiến sĩ thi đua", "Huân chương Lao động"],
    correctAnswer: 1,
  },
  {
    question: "Tổng số lần Binh chủng Công binh đã vinh dự nhận danh hiệu Anh hùng LLVTND?",
    options: ["1 lần", "2 lần", "3 lần", "4 lần"],
    correctAnswer: 1,
  },
];

const Games = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [showSubmission, setShowSubmission] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [timeStarted, setTimeStarted] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    rank: "",
    position: "",
    unit: "",
    phoneNumber: "",
  });

  const handleStartGame = () => {
    setTimeStarted(Date.now());
  };

  const handleSelectAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    if (timeStarted === null) setTimeStarted(Date.now());

    setSelectedAnswer(index);
    setShowResult(true);

    if (index === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 10);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameFinished(true);
    }
  };

  const handleSubmitResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.rank || !formData.unit) {
      toast.error("Vui lòng điền các trường bắt buộc (*)");
      return;
    }

    setIsSubmitting(true);
    try {
      const completionTime = timeStarted ? Math.floor((Date.now() - timeStarted) / 1000) : 0;
      const response = await api.post("/quiz/submit", {
        ...formData,
        score,
        completionTime,
      });
      toast.success("Nộp kết quả thành công!");
      setShowSubmission(false);
      handleFetchLeaderboard();
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Không thể nộp kết quả. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFetchLeaderboard = async () => {
    try {
      const response = await api.get("/quiz/leaderboard");
      if (response.data && response.data.data) {
        setLeaderboardData(response.data.data);
        setShowLeaderboard(true);
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      toast.error("Không thể tải bảng xếp hạng.");
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameFinished(false);
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const question = quizQuestions[currentQuestion];

  const getOptionStyle = (index: number) => {
    if (!showResult) {
      return "bg-card hover:bg-secondary border-border hover:border-primary/50";
    }
    if (index === question.correctAnswer) {
      return "bg-green-50 border-green-500 text-green-700";
    }
    if (index === selectedAnswer && index !== question.correctAnswer) {
      return "bg-red-50 border-red-500 text-red-700";
    }
    return "bg-card border-border opacity-50";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-4 uppercase leading-tight">
            CUỘC THI TÌM HIỂU 80 NĂM THÀNH LẬP BINH CHỦNG CÔNG BINH <br className="hidden md:block" /> (25/3/1946 - 25/3/2026)
          </h1>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mb-6" />
          <p className="text-muted-foreground mb-6">
            Hãy cùng ôn lại truyền thống vẻ vang "Mở đường thắng lợi" của bộ đội Công binh
          </p>
          <Button
            onClick={handleFetchLeaderboard}
            variant="outline"
            className="gap-2 border-primary text-primary hover:bg-primary/10 rounded-full"
          >
            <Trophy className="w-4 h-4" />
            Xem bảng xếp hạng
          </Button>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          {!gameFinished ? (
            <div className="max-w-2xl mx-auto">
              {/* Progress Card */}
              <div className="bg-card rounded-xl p-5 shadow-sm mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-muted-foreground">Tiến trình</span>
                  <span className="text-sm font-medium text-foreground">
                    Câu {currentQuestion + 1}/{quizQuestions.length}
                  </span>
                </div>
                <Progress value={progress} className="h-2 mb-4" />
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="text-foreground">Điểm: {score}</span>
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-card rounded-xl p-6 shadow-elegant">
                <span className="inline-block px-3 py-1.5 rounded-full bg-primary text-card text-sm font-medium mb-4">
                  Câu hỏi {currentQuestion + 1}
                </span>

                <h2 className="text-xl md:text-2xl font-serif font-semibold text-foreground mb-6">
                  {question.question}
                </h2>

                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectAnswer(index)}
                      disabled={showResult}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${getOptionStyle(index)}`}
                    >
                      <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium text-foreground shrink-0">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {showResult && index === question.correctAnswer && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {showResult && index === selectedAnswer && index !== question.correctAnswer && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </button>
                  ))}
                </div>

                {showResult && (
                  <Button onClick={handleNextQuestion} className="w-full mt-6">
                    {currentQuestion < quizQuestions.length - 1 ? "Câu tiếp theo" : "Xem kết quả"}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            /* Result Screen */
            <div className="max-w-md mx-auto text-center">
              <div className="bg-card rounded-2xl p-8 shadow-elegant">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
                  Hoàn thành!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Bạn đã trả lời đúng {score / 10}/{quizQuestions.length} câu hỏi
                </p>
                <div className="text-5xl font-serif font-bold text-primary mb-6">
                  {score} điểm
                </div>
                <div className="flex flex-col gap-3">
                  <Button onClick={() => setShowSubmission(true)} className="w-full">
                    Nộp kết quả
                  </Button>
                  <Button onClick={handleRestart} variant="outline" className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Chơi lại
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modals outside of conditional rendering for global accessibility */}
      <SubmissionModalComponent
        open={showSubmission}
        onOpenChange={setShowSubmission}
        formData={formData}
        setFormData={setFormData}
        handleSubmitResult={handleSubmitResult}
        isSubmitting={isSubmitting}
      />

      <LeaderboardModalComponent
        open={showLeaderboard}
        onOpenChange={setShowLeaderboard}
        leaderboardData={leaderboardData}
      />

      <Footer />
    </div>
  );
};

// Extracted for clarity and to ensure they are at the top level of the DOM when needed
const SubmissionModalComponent = ({ open, onOpenChange, formData, setFormData, handleSubmitResult, isSubmitting }: any) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Thông tin người dự thi</DialogTitle>
        <DialogDescription>
          Vui lòng điền thông tin để lưu lại kết quả của bạn.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmitResult} className="space-y-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Họ và tên <span className="text-red-500">*</span></Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nguyễn Văn A"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="birthDate">Ngày sinh</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e: any) => setFormData({ ...formData, birthDate: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="rank">Cấp bậc, chức vụ <span className="text-red-500">*</span></Label>
            <Input
              id="rank"
              value={formData.rank}
              onChange={(e: any) => setFormData({ ...formData, rank: e.target.value })}
              placeholder="Nhập cấp bậc, chức vụ"
              required
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="unit">Đơn vị <span className="text-red-500">*</span></Label>
          <Input
            id="unit"
            value={formData.unit}
            onChange={(e: any) => setFormData({ ...formData, unit: e.target.value })}
            placeholder="Tiểu đoàn 1"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input
            id="phone"
            value={formData.phoneNumber}
            onChange={(e: any) => setFormData({ ...formData, phoneNumber: e.target.value })}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Đang gửi..." : "Gửi kết quả"}
        </Button>
      </form>
    </DialogContent>
  </Dialog>
);

const LeaderboardModalComponent = ({ open, onOpenChange, leaderboardData }: any) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-4xl max-h-[90vh] md:max-h-[80vh] overflow-y-auto px-4 md:px-6">
      <DialogHeader>
        <DialogTitle className="text-xl md:text-2xl font-serif font-bold text-gold text-center">BẢNG XẾP HẠNG</DialogTitle>
      </DialogHeader>

      <div className="py-4">
        {/* Desktop View: Table */}
        <div className="hidden md:block relative overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-secondary/50 font-medium text-muted-foreground">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">Hạng</th>
                <th className="px-4 py-3 whitespace-nowrap">Họ và tên</th>
                <th className="px-4 py-3 whitespace-nowrap">Đơn vị</th>
                <th className="px-4 py-3 whitespace-nowrap">Điểm</th>
                <th className="px-4 py-3 whitespace-nowrap">Thời gian làm bài</th>
                <th className="px-4 py-3 whitespace-nowrap">Ngày nộp</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((item: any, index: number) => (
                <tr key={item.id} className="border-t border-border hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 font-bold whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span>{index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : ""}</span>
                      <span>Hạng {index + 1}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-semibold whitespace-nowrap">{item.name}</div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">{item.rank}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{item.unit}</td>
                  <td className="px-4 py-3 font-bold text-primary whitespace-nowrap">{item.score}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{item.completionTime}s</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                    {item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    }).replace(/, /g, ' ') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Cards */}
        <div className="md:hidden space-y-4">
          {leaderboardData.map((item: any, index: number) => (
            <div key={item.id} className="bg-card rounded-xl p-4 border border-border shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-start border-b border-border pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : ""}</span>
                  <span className="font-bold text-primary">Hạng {index + 1}</span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-primary">{item.score} điểm</div>
                  <div className="text-xs text-muted-foreground">{item.completionTime} giây</div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-medium">Họ và tên</div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.rank}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-medium">Đơn vị</div>
                  <div>{item.unit}</div>
                </div>
                <div className="pt-2 border-t border-border mt-1">
                  <div className="text-[10px] text-muted-foreground flex justify-between">
                    <span>Ngày nộp:</span>
                    <span>
                      {item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      }).replace(/, /g, ' ') : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default Games;
