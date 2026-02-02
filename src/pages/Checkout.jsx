import { useCart } from "@/hooks/use-cart";
import { Link } from "wouter";
import { Lock, Check, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Checkout() {
  const { data: cartItems } = useCart();
  const subtotal = cartItems?.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0) || 0;
  const count = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const handlePlaceOrder = () => {
    toast({
      title: "Order Placed Successfully!",
      description: "Thank you for shopping with FreshMart. Your order is on its way!",
      duration: 5000,
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-white border-b py-4">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link href="/cart" className="flex items-center gap-2 text-muted-foreground hover:text-primary">
            <ChevronLeft className="w-5 h-5" />
            Back to Cart
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">F</span>
            </div>
            <span className="font-bold">FreshMart</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Lock className="w-4 h-4" />
            Secure Checkout
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                <span className={`text-sm hidden sm:block ${step >= s ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {s === 1 ? 'Shipping' : s === 2 ? 'Payment' : 'Review'}
                </span>
                {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-primary' : 'bg-muted'}`}></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Forms */}
          <div className="lg:col-span-3 space-y-6">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="bg-white rounded-2xl border p-6">
                <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name</label>
                      <input type="text" className="w-full border rounded-lg px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" required data-testid="input-firstname" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name</label>
                      <input type="text" className="w-full border rounded-lg px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" required data-testid="input-lastname" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Address</label>
                    <input type="text" className="w-full border rounded-lg px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" required data-testid="input-address" />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City</label>
                      <input type="text" className="w-full border rounded-lg px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" required data-testid="input-city" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">State</label>
                      <input type="text" className="w-full border rounded-lg px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">ZIP Code</label>
                      <input type="text" className="w-full border rounded-lg px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" required data-testid="input-zip" />
                    </div>
                  </div>
                  <button type="submit" className="w-full btn-primary mt-4" data-testid="button-continue-payment">
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded-2xl border p-6">
                <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                <div className="space-y-4">
                  <label className="flex items-start gap-4 p-4 border rounded-xl cursor-pointer hover:border-primary transition-colors">
                    <input type="radio" name="payment" defaultChecked className="mt-1 text-primary focus:ring-primary" data-testid="radio-card" />
                    <div className="flex-1">
                      <p className="font-medium">Credit / Debit Card</p>
                      <div className="mt-4 space-y-3">
                        <input placeholder="Card Number" className="w-full border rounded-lg px-4 py-2.5 focus:border-primary outline-none" data-testid="input-card-number" />
                        <div className="grid grid-cols-2 gap-3">
                          <input placeholder="MM/YY" className="border rounded-lg px-4 py-2.5 focus:border-primary outline-none" data-testid="input-card-expiry" />
                          <input placeholder="CVV" className="border rounded-lg px-4 py-2.5 focus:border-primary outline-none" data-testid="input-card-cvv" />
                        </div>
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:border-primary transition-colors">
                    <input type="radio" name="payment" className="text-primary focus:ring-primary" data-testid="radio-cod" />
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                    </div>
                  </label>
                </div>
                <button onClick={() => setStep(3)} className="w-full btn-primary mt-6" data-testid="button-continue-review">
                  Continue to Review
                </button>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="bg-white rounded-2xl border p-6">
                <h2 className="text-xl font-bold mb-6">Review Your Order</h2>
                <div className="space-y-4 mb-6">
                  {cartItems?.map(item => (
                    <div key={item.id} className="flex gap-4 py-3 border-b last:border-0" data-testid={`checkout-item-${item.id}`}>
                      <div className="w-16 h-16 bg-muted/30 rounded-lg p-2 flex-shrink-0">
                        <img src={item.product.image} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold">${(Number(item.product.price) * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <button onClick={handlePlaceOrder} className="w-full btn-accent text-lg py-3" data-testid="button-place-order">
                  Place Order - ${subtotal.toFixed(2)}
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border p-6 sticky top-24">
              <h3 className="font-bold mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items ({count})</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-primary font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>$0.00</span>
                </div>
              </div>
              <div className="border-t my-4"></div>
              <div className="flex justify-between font-bold text-lg" data-testid="text-order-total">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
