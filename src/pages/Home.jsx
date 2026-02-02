import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { ChevronRight, Truck, Shield, Clock, Leaf } from "lucide-react";
import { Link } from "wouter";

const CATEGORIES = [
  { name: "Atta & Rice", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop", slug: "Atta, Rice & Dal" },
  { name: "Spices", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=300&fit=crop", slug: "Masalas & Spices" },
  { name: "Oil & Ghee", image: "https://images.unsplash.com/photo-1474979266404-7cadd91acc16?w=300&h=300&fit=crop", slug: "Oil & Ghee" },
  { name: "Snacks", image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&h=300&fit=crop", slug: "Snacks, Chips & Namkeen" },
  { name: "Beverages", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&h=300&fit=crop", slug: "Cold Drinks & Juices" },
  { name: "Cleaning", image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fcaf3?w=300&h=300&fit=crop", slug: "Cleaning Essentials" },
];

const FEATURES = [
  { icon: Truck, title: "Free Delivery", desc: "On orders over $50" },
  { icon: Clock, title: "Same Day", desc: "Fast delivery options" },
  { icon: Shield, title: "Secure Pay", desc: "100% secure checkout" },
  { icon: Leaf, title: "Fresh Quality", desc: "Hand-picked products" },
];

export default function Home() {
  const { data: products, isLoading } = useProducts({ category: "All" });
  const { data: dealsProducts } = useProducts({ isTodaysDeal: "true" });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Leaf className="w-4 h-4" />
                Fresh & Organic
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Fresh Groceries <br/>
                <span className="text-primary">Delivered Fast</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Get fresh fruits, vegetables, dairy, and daily essentials delivered to your doorstep in hours.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/shop" className="btn-primary inline-flex items-center gap-2" data-testid="button-shop-now">
                  Shop Now <ChevronRight className="w-4 h-4" />
                </Link>
                <Link href="/shop?isTodaysDeal=true" className="btn-secondary inline-flex items-center gap-2" data-testid="button-view-deals">
                  View Deals
                </Link>
              </div>
            </div>
            <div className="relative hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=500&fit=crop" 
                alt="Fresh groceries" 
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                    <Truck className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Free Delivery</p>
                    <p className="text-sm text-muted-foreground">On orders $50+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {FEATURES.map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground">Shop by Category</h2>
          <Link href="/shop" className="text-primary font-medium hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, i) => (
            <Link 
              key={i} 
              href={`/shop?category=${encodeURIComponent(cat.slug)}`}
              className="group"
              data-testid={`link-category-${i}`}
            >
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted mb-3">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <p className="font-medium text-center text-foreground group-hover:text-primary transition-colors">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Today's Deals */}
      {dealsProducts && dealsProducts.length > 0 && (
        <section className="bg-accent/5 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Today's Deals</h2>
                <p className="text-muted-foreground">Limited time offers on popular products</p>
              </div>
              <Link href="/shop?isTodaysDeal=true" className="text-primary font-medium hover:underline flex items-center gap-1" data-testid="link-all-deals">
                See All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {dealsProducts.slice(0, 5).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground">Popular Products</h2>
          <Link href="/shop" className="text-primary font-medium hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-muted rounded-2xl aspect-[3/4] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products?.slice(0, 10).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 md:p-12 text-white text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Get 20% Off Your First Order</h3>
          <p className="text-white/80 mb-6 max-w-md mx-auto">Sign up for our newsletter and receive exclusive deals and updates.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-3 rounded-xl text-foreground outline-none"
            />
            <button className="btn-accent">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
}
