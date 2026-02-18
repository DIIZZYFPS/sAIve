import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export const useDeleteTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/transactions/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["user_assets"] });
            queryClient.invalidateQueries({ queryKey: ["category_totals"] });
            queryClient.invalidateQueries({ queryKey: ["monthly_totals"] });
            queryClient.invalidateQueries({ queryKey: ["daily_spending"] });
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        },
    });
};
