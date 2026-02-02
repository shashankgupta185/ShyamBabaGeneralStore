import { useCart, useRemoveCartItem, useUpdateCartItem, useClearCart } from "@/hooks/use-cart";
import { Link } from "wouter";
import { Loader2, Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";

export default function Cart() {
  const { data: cartItems, isLoading, refetch } = useCart();
  const removeItem = useRemoveCartItem();
  const updateItem = useUpdateCartItem();
  const clearCart = useClearCart();

  const subtotal = cartItems?.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0) || 0;
  const count = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
          </p>
          <Link href="/shop" className="btn-primary inline-flex items-center gap-2" data-testid="link-continue-shopping">
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Shopping Cart ({count} items)</h1>
          <button 
            onClick={() => clearCart.mutate(() => refetch())} 
            className="text-sm text-muted-foreground hover:text-destructive transition-colors"
            data-testid="button-clear-cart"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border p-4 flex gap-4" data-testid={`cart-item-${item.id}`}>
                <div className="w-24 h-24 bg-muted/30 rounded-xl flex-shrink-0 p-2">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.product.id}`} className="font-medium text-foreground hover:text-primary line-clamp-2">
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">{item.product.category}</p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border rounded-lg">
                      <button 
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateItem.mutate({ id: item.id, quantity: item.quantity - 1 }, () => refetch());
                          }
                        }}
                        className="p-2 hover:bg-muted transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateItem.mutate({ id: item.id, quantity: item.quantity + 1 }, () => refetch())}
                        className="p-2 hover:bg-muted transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <span className="font-bold text-lg" data-testid={`text-item-price-${item.id}`}>
                      ${(Number(item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => removeItem.mutate(item.id, () => refetch())}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors self-start"
                  data-testid={`button-delete-${item.id}`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({count} items)</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-primary">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
              </div>
              
              <div className="border-t my-4"></div>
              
              <div className="flex justify-between text-lg font-bold mb-6" data-testid="text-subtotal">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <Link href="/checkout" className="w-full">
                <button className="w-full btn-primary flex items-center justify-center gap-2" data-testid="button-checkout">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
              </Link>

              <Link href="/shop" className="block text-center text-sm text-primary mt-4 hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
