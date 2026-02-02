import { useState, useEffect, useCallback } from "react";
import { API_ROUTES } from "@/config/api";

export function useProducts(params) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const url = new URL(API_ROUTES.products.list);

      if (params) {
        if (params.category && params.category !== "All") {
          url.searchParams.append("category", params.category);
        }
        if (params.search) {
          url.searchParams.append("search", params.search);
        }
        if (params.isTodaysDeal) {
          url.searchParams.append("isTodaysDeal", params.isTodaysDeal);
        }
      }

      const res = await fetch(url.toString(), {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch products");

      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [params?.category, params?.search, params?.isTodaysDeal]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { data, isLoading, error, refetch: fetchProducts };
}

export function useProduct(id) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(API_ROUTES.products.get(id), {
          credentials: "include",
        });

        if (res.status === 404) {
          setData(null);
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch product");

        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { data, isLoading, error };
}
