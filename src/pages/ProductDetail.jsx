import { useProduct } from "@/hooks/use-products";
import { useRoute, Link } from "wouter";
import { Loader2, Star, Minus, Plus, ShoppingBag, Truck, Shield, RotateCcw, ChevronLeft } from "lucide-react";
import { useAddToCart, useCart } from "@/hooks/use-cart";
import { useState } from "react";

export default function ProductDetail() {
  const [match, params] = useRoute("/product/:id");
  const id = params ? parseInt(params.id) : 0;
  const [quantity, setQuantity] = useState(1);
  
  const { data: product, isLoading } = useProduct(id);
  const addToCart = useAddToCart();
  const { refetch } = useCart();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link href="/" className="btn-primary inline-block">Return Home</Link>
      </div>
    );
  }

  const discount = product.originalPrice 
    ? Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart.mutate(product.id, () => refetch());
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-3xl border overflow-hidden p-8">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-contain" 
                data-testid="img-product-main"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <button 
                  key={i} 
                  className="aspect-square bg-white rounded-xl border p-3 hover:border-primary transition-colors"
                  data-testid={`img-thumbnail-${i}`}
                >
                  <img src={product.image} alt="" className="w-full h-full object-contain opacity-80" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {product.isTodaysDeal && (
              <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold">
                {discount}% OFF - Limited Time Deal
              </div>
            )}

            <div>
              <Link href={`/shop?category=${encodeURIComponent(product.category)}`} className="text-primary text-sm font-medium hover:underline">
                {product.category}
              </Link>
              <h1 className="text-3xl font-bold text-foreground mt-2" data-testid="text-product-name">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(Number(product.rating)) ? "fill-current" : "text-gray-300"}`} />
                ))}
              </div>
              <span className="text-muted-foreground" data-testid="text-review-count">
                {product.reviewCount} reviews
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-foreground" data-testid="text-price">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                <span className="text-xl text-muted-foreground line-through">
                  ${Number(product.originalPrice).toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed" data-testid="text-description">
              {product.description}
            </p>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center border rounded-xl">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-muted transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-muted transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={addToCart.isPending}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
                data-testid="button-add-to-cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {addToCart.isPending ? "Adding..." : "Add to Cart"}
              </button>
            </div>

            <button className="w-full btn-accent" data-testid="button-buy-now">
              Buy Now
            </button>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Free Delivery</p>
                <p className="text-xs text-muted-foreground">On $50+ orders</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-muted-foreground">30-day policy</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Secure</p>
                <p className="text-xs text-muted-foreground">100% safe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
