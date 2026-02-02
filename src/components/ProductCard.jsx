import { Link } from "wouter";
import { Star, ShoppingBag } from "lucide-react";
import { useAddToCart, useCart } from "@/hooks/use-cart";

export function ProductCard({ product }) {
  const addToCart = useAddToCart();
  const { refetch } = useCart();

  const discount = product.originalPrice 
    ? Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart.mutate(product.id, () => refetch());
  };

  return (
    <div className="bg-white rounded-2xl border border-border/50 overflow-hidden group hover:shadow-lg hover:border-primary/20 transition-all duration-300" data-testid={`product-card-${product.id}`}>
      {/* Image */}
      <Link href={`/product/${product.id}`} className="block relative aspect-square bg-muted/30 overflow-hidden">
        {product.isTodaysDeal && (
          <div className="absolute top-3 left-3 z-10 bg-accent text-white text-xs px-2.5 py-1 rounded-full font-semibold">
            {discount}% OFF
          </div>
        )}
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500" 
        />
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/product/${product.id}`} className="block mb-2">
          <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors" data-testid={`link-product-${product.id}`}>
            {product.name}
          </h3>
        </Link>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-accent">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={`w-3.5 h-3.5 ${i < Math.floor(Number(product.rating)) ? "fill-current" : "text-gray-300"}`} 
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-lg font-bold text-foreground" data-testid={`text-product-price-${product.id}`}>
              ${Number(product.price).toFixed(2)}
            </span>
            {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
              <span className="text-sm text-muted-foreground line-through ml-2">
                ${Number(product.originalPrice).toFixed(2)}
              </span>
            )}
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={addToCart.isPending}
            className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50"
            data-testid={`button-add-to-cart-${product.id}`}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
