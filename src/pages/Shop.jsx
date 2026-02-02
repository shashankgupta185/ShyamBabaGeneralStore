import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { useLocation } from "wouter";
import { Loader2, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

const CATEGORIES = [
  "Atta, Rice & Dal",
  "Masalas & Spices",
  "Oil & Ghee",
  "Snacks, Chips & Namkeen",
  "Cold Drinks & Juices",
  "Cleaning Essentials",
  "Bath & Body",
  "Grooming",
];

export default function Shop() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const isTodaysDeal = searchParams.get("isTodaysDeal");
  const [showFilters, setShowFilters] = useState(false);

  const { data: products, isLoading } = useProducts({ 
    category: category || undefined,
    search: search || undefined,
    isTodaysDeal: isTodaysDeal || undefined
  });

  const clearFilters = () => {
    setLocation("/shop");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {isTodaysDeal ? "Today's Deals" : category || (search ? `Results for "${search}"` : "All Products")}
              </h1>
              <p className="text-muted-foreground" data-testid="text-results-count">
                {products?.length || 0} products found
              </p>
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 border rounded-lg"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Active Filters */}
          {(category || search || isTodaysDeal) && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              {category && (
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  {category}
                  <button onClick={() => {
                    const params = new URLSearchParams(window.location.search);
                    params.delete("category");
                    setLocation(`/shop${params.toString() ? '?' + params.toString() : ''}`);
                  }}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {isTodaysDeal && (
                <span className="inline-flex items-center gap-1 bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium">
                  Deals Only
                  <button onClick={() => {
                    const params = new URLSearchParams(window.location.search);
                    params.delete("isTodaysDeal");
                    setLocation(`/shop${params.toString() ? '?' + params.toString() : ''}`);
                  }}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button 
                onClick={clearFilters}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`w-64 flex-shrink-0 space-y-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white p-5 rounded-xl border">
              <h3 className="font-semibold text-foreground mb-4">Categories</h3>
              <ul className="space-y-2">
                {CATEGORIES.map(cat => (
                  <li key={cat}>
                    <button
                      onClick={() => setLocation(`/shop?category=${encodeURIComponent(cat)}`)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        category === cat 
                          ? 'bg-primary text-white' 
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-5 rounded-xl border">
              <h3 className="font-semibold text-foreground mb-4">Special Offers</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isTodaysDeal === 'true'}
                  onChange={(e) => {
                    if (e.target.checked) {
                      const params = new URLSearchParams(window.location.search);
                      params.set("isTodaysDeal", "true");
                      setLocation(`/shop?${params.toString()}`);
                    } else {
                      const params = new URLSearchParams(window.location.search);
                      params.delete("isTodaysDeal");
                      setLocation(`/shop${params.toString() ? '?' + params.toString() : ''}`);
                    }
                  }}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">Today's Deals</span>
              </label>
            </div>

            <div className="bg-white p-5 rounded-xl border">
              <h3 className="font-semibold text-foreground mb-4">Rating</h3>
              <div className="space-y-2">
                {[4, 3, 2, 1].map(stars => (
                  <button key={stars} className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex text-accent">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < stars ? "" : "text-gray-300"}>&#9733;</span>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">& Up</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : products?.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border">
                <h2 className="text-xl font-semibold mb-2">No products found</h2>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search query.</p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
