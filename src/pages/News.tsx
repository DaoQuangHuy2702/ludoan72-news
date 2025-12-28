import { useState, useMemo, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import FeaturedNews from "@/components/FeaturedNews";
import NewsGrid from "@/components/NewsGrid";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";
import api, { getMediaUrl } from "@/lib/api";
import { format } from "date-fns";

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

  const [featuredArticle, setFeaturedArticle] = useState<any>(null);
  const [latestArticles, setLatestArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const baseParams: any = { type: 'NEWS' };

        if (activeCategory !== "Tất cả") {
          const selectedCategory = dynamicCategories.find(c =>
            typeof c !== 'string' && c.name === activeCategory
          ) as Category | undefined;

          if (selectedCategory) {
            baseParams.categoryId = selectedCategory.id;
          }
        }

        // Fetch Featured Article (Top 1 by views, then newest)
        const featuredParams = { ...baseParams };
        // If sorting or other params are needed for featured specifically, add them here
        // The backend handles the specific logic for /featured endpoint

        const featuredResponse = await api.get('/public/articles/featured', { params: featuredParams });

        // Fetch Latest Articles (Paginated, sorted by newest)
        const latestParams = {
          ...baseParams,
          page: currentPage - 1,
          size: 6,
          sort: 'createdAt,desc'
        };
        const latestResponse = await api.get('/public/articles', { params: latestParams });

        if (featuredResponse.data?.success && featuredResponse.data.data) {
          const item = featuredResponse.data.data;
          setFeaturedArticle({
            id: item.id,
            title: item.title,
            excerpt: item.excerpt,
            category: item.category ? item.category.name : "Tin tức",
            date: item.createdAt ? format(new Date(item.createdAt), "dd/MM/yyyy") : "",
            views: item.views,
            image: getMediaUrl(item.thumbnail),
            readTime: "5 phút"
          });
        } else {
          setFeaturedArticle(null);
        }

        if (latestResponse.data?.success) {
          const mappedArticles = latestResponse.data.data.content.map((item: any) => ({
            id: item.id,
            title: item.title,
            excerpt: item.excerpt,
            category: item.category ? item.category.name : "Tin tức",
            date: item.createdAt ? format(new Date(item.createdAt), "dd/MM/yyyy") : "",
            views: item.views,
            image: getMediaUrl(item.thumbnail),
            readTime: "5 phút"
          }));
          setLatestArticles(mappedArticles);
          setTotalPages(latestResponse.data.data.totalPages);
        }
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    };

    if (dynamicCategories.length > 1) {
      fetchData();
    }
  }, [activeCategory, dynamicCategories, currentPage]);

  const categoriesMetadata = useMemo(() => {
    return dynamicCategories.filter(c => typeof c !== 'string') as Category[];
  }, [dynamicCategories]);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
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
        {loading ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">Đang tải bài viết...</p>
          </div>
        ) : featuredArticle || latestArticles.length > 0 ? (
          <>
            {featuredArticle && (
              <FeaturedNews article={featuredArticle} categories={categoriesMetadata} />
            )}

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 pl-4 border-l-4 border-primary">Tin mới nhất</h2>
              <NewsGrid articles={latestArticles} categories={categoriesMetadata} />
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-lg mx-4 md:mx-0 my-8">
            <div className="bg-background p-4 rounded-full mb-4 shadow-sm">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Chưa có bài viết nào</h3>
            <p className="text-muted-foreground text-center max-w-md px-4">
              Hiện tại chưa có bài viết nào trong danh mục này. Vui lòng quay lại sau.
            </p>
          </div>
        )}
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default News;
