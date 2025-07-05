import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchStockItemsPaginated } from "../services/api";
import Cookies from "js-cookie";

export function usePaginatedStockItems(searchText = "", upc = "") {
  const token = Cookies.get("token");
  return useInfiniteQuery({
    queryKey: ["stockItems", searchText, upc],
    queryFn: async ({ pageParam = 1 }) => {
      const data = await fetchStockItemsPaginated({
        StockDesc: searchText,
        upc,
        pageNumber: pageParam,
        token,
      });
      return {
        items: data.data || [],
        total: parseInt(data.status3, 10) || 0,
        nextPage: data.data && data.data.length > 0 ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.flatMap((p) => p.items).length;
      if (loaded < lastPage.total) {
        return lastPage.nextPage;
      }
      return undefined;
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 20, // 20 minutes
  });
}
