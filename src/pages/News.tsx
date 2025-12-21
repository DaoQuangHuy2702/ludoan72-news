import { useState, useMemo, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import FeaturedNews from "@/components/FeaturedNews";
import NewsGrid from "@/components/NewsGrid";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { featuredArticle, newsArticles } from "@/data/newsData";
import api from "@/lib/api";

interface Category {
  id: string;
  name: string;
  colorCode: string;
}

const News = () => {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [dynamicCategories, setDynamicCategories] = useState<(string | Category)[]>(["Tất cả"]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories', { params: { size: 100 } });
        if (response.data && response.data.success) {
          setDynamicCategories(["Tất cả", ...response.data.data.content]);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const categoriesMetadata = useMemo(() => {
    return dynamicCategories.filter(c => typeof c !== 'string') as Category[];
  }, [dynamicCategories]);

  const filteredArticles = useMemo(() => {
    if (activeCategory === "Tất cả") return newsArticles;
    return newsArticles.filter((article) => article.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CategoryFilter
          categories={dynamicCategories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        <FeaturedNews article={featuredArticle} categories={categoriesMetadata} />
        <NewsGrid articles={filteredArticles} categories={categoriesMetadata} />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default News;
