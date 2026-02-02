import { Link, useLocation } from "wouter";
import { Search, ShoppingBag, Menu, User, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/use-cart";

const CATEGORIES = [
  "All",
  "Atta & Rice",
  "Spices",
  "Oil & Ghee",
  "Snacks",
  "Beverages",
  "Cleaning",
  "Personal Care",
];

const Header = () => {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: cartItems } = useCart();

  const cartCount =
    cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0"
            data-testid="link-logo"
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">F</span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">
              FreshMart
            </span>
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-xl hidden md:flex"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2.5 rounded-full border border-border bg-muted/50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="Search for groceries, snacks, drinks..."
                data-testid="input-search"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors"
                data-testid="button-search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              data-testid="link-account"
            >
              <User className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium">Sign In</span>
            </Link>

            <Link
              href="/cart"
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors relative"
              data-testid="link-cart"
            >
              <ShoppingBag className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium hidden sm:block">Cart</span>
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  data-testid="text-cart-count"
                >
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Category Navigation */}
        <nav className="hidden md:flex items-center gap-1 pb-3 overflow-x-auto hide-scrollbar">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={
                cat === "All"
                  ? "/shop"
                  : `/shop?category=${encodeURIComponent(cat)}`
              }
              className="px-4 py-1.5 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full transition-colors whitespace-nowrap"
            >
              {cat}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="p-4">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-border bg-muted/50 focus:bg-white focus:border-primary outline-none"
                  placeholder="Search products..."
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-lg"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={
                    cat === "All"
                      ? "/shop"
                      : `/shop?category=${encodeURIComponent(cat)}`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium bg-muted rounded-lg text-center hover:bg-primary hover:text-white transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
