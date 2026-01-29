import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import News from "./pages/News";
import Activities from "./pages/Activities";
import Games from "./pages/Games";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "@/components/admin/AdminLayout";
import WarriorList from "@/pages/admin/warriors/WarriorList";
import WarriorForm from "@/pages/admin/warriors/WarriorForm";
import WarriorDetail from "@/pages/admin/warriors/WarriorDetail";
import LeaveManagement from "@/pages/admin/warriors/LeaveManagement";
import LeaveHistory from "@/pages/admin/warriors/LeaveHistory";
import LeaveRequestForm from "@/pages/admin/warriors/LeaveRequestForm";
import CategoryList from "@/pages/admin/categories/CategoryList";
import CategoryForm from "@/pages/admin/categories/CategoryForm";
import ArticleList from "@/pages/admin/articles/ArticleList";
import ArticleForm from "@/pages/admin/articles/ArticleForm";
import NewsDetail from "./pages/NewsDetail";
import ActivitiesList from "./pages/ActivitiesList";
import QuizResultList from "@/pages/admin/quiz/QuizResultList";
import QuizList from "@/pages/admin/quiz/QuizList";
import QuizForm from "@/pages/admin/quiz/QuizForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner position="top-center" duration={3000} />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/activities/:type" element={<ActivitiesList />} />
        <Route path="/games" element={<Games />} />
        <Route path="/contact" element={<Contact />} />
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/warriors" replace />} />
          <Route path="warriors" element={<WarriorList />} />
          <Route path="warriors/new" element={<WarriorForm />} />
          <Route path="warriors/:id" element={<WarriorForm />} />
          <Route path="warriors/:id/detail" element={<WarriorDetail />} />
          <Route path="warriors/leave" element={<LeaveManagement />} />
          <Route path="warriors/:id/leave" element={<LeaveHistory />} />
          <Route path="warriors/:id/leave/new" element={<LeaveRequestForm />} />
          <Route path="leave-requests/:requestId" element={<LeaveRequestForm />} />

          <Route path="categories" element={<CategoryList />} />
          <Route path="categories/new" element={<CategoryForm />} />
          <Route path="categories/:id" element={<CategoryForm />} />

          <Route path="articles" element={<ArticleList />} />
          <Route path="articles/new" element={<ArticleForm />} />
          <Route path="articles/:id" element={<ArticleForm />} />
          <Route path="quizzes" element={<QuizList />} />
          <Route path="quizzes/new" element={<QuizForm />} />
          <Route path="quizzes/:id" element={<QuizForm />} />
          <Route path="quiz-results" element={<QuizResultList />} />
        </Route>

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
