import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchCustomersPaginated } from "../services/api";
import Cookies from "js-cookie";

export function usePaginatedCustomers(searchText = "") {
  const token = Cookies.get("token");
  return useInfiniteQuery({
    queryKey: ["customers", searchText],
    queryFn: async ({ pageParam = 1 }) => {
      const data = await fetchCustomersPaginated({
        searchText,
        pageNumber: pageParam,
        token,
      });
      return {
        customers: data.data || [],
        total: parseInt(data.status3, 10) || 0,
        nextPage: data.data && data.data.length > 0 ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.flatMap((p) => p.customers).length;
      if (loaded < lastPage.total) {
        return lastPage.nextPage;
      }
      return undefined;
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 20, // 5 minutes
  });
}
