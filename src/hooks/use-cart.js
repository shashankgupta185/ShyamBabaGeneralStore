import { useState, useEffect, useCallback } from "react";
import { API_ROUTES } from "@/config/api";
import { useToast } from "@/hooks/use-toast";

function generateSessionId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function useSessionId() {
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    let stored = localStorage.getItem("shop_session_id");
    if (!stored) {
      stored = generateSessionId();
      localStorage.setItem("shop_session_id", stored);
    }
    setSessionId(stored);
  }, []);

  return sessionId;
}

export function useCart() {
  const sessionId = useSessionId();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    if (!sessionId) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(API_ROUTES.cart.list(sessionId), {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch cart");

      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return { data, isLoading, error, refetch: fetchCart };
}

export function useAddToCart() {
  const sessionId = useSessionId();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  const mutate = async (productId, onSuccess) => {
    if (!sessionId) return;

    setIsPending(true);
    try {
      const res = await fetch(API_ROUTES.cart.addItem, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          sessionId,
          productId,
          quantity: 1,
        }),
      });

      if (!res.ok) throw new Error("Failed to add item");

      toast({
        title: "Added to Cart",
        description: "Item has been added to your cart.",
        duration: 2000,
      });

      onSuccess?.();
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
}

export function useUpdateCartItem() {
  const [isPending, setIsPending] = useState(false);

  const mutate = async ({ id, quantity }, onSuccess) => {
    setIsPending(true);
    try {
      const res = await fetch(API_ROUTES.cart.updateItem(id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity }),
      });

      if (!res.ok) throw new Error("Failed to update cart item");

      onSuccess?.();
    } catch (err) {
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
}

export function useRemoveCartItem() {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (id, onSuccess) => {
    setIsPending(true);
    try {
      const res = await fetch(API_ROUTES.cart.removeItem(id), {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to remove item");

      onSuccess?.();
    } catch (err) {
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
}

export function useClearCart() {
  const sessionId = useSessionId();
  const [isPending, setIsPending] = useState(false);

  const mutate = async (onSuccess) => {
    if (!sessionId) return;

    setIsPending(true);
    try {
      const res = await fetch(API_ROUTES.cart.clear(sessionId), {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to clear cart");

      onSuccess?.();
    } catch (err) {
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
}
