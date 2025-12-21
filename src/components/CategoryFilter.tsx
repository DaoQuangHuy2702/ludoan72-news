import { CSSProperties } from "react";

interface Category {
  id: string;
  name: string;
  colorCode?: string;
}

interface CategoryFilterProps {
  categories: (string | Category)[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 py-8">
      {categories.map((cat) => {
        const name = typeof cat === 'string' ? cat : cat.name;
        const color = typeof cat === 'string' ? undefined : cat.colorCode;
        const isActive = activeCategory === name;

        const style: Record<string, string> = color ? {
          "--cat-color": color,
        } : {};

        return (
          <button
            key={name}
            onClick={() => onCategoryChange(name)}
            style={style as CSSProperties}
            className={`filter-btn ${color
              ? `filter-btn-dynamic ${isActive ? "filter-btn-dynamic-active" : ""}`
              : isActive ? "filter-btn-active" : "filter-btn-inactive"
              }`}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
