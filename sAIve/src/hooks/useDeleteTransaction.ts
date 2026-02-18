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
            queryClient.invalidateQueries({ queryKey: ["assets"] });
            queryClient.invalidateQueries({ queryKey: ["asset"] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["statsCategories"] });
            queryClient.invalidateQueries({ queryKey: ["statsHistory"] });
            queryClient.invalidateQueries({ queryKey: ["categoryHistory"] });
            queryClient.invalidateQueries({ queryKey: ["dailySpending"] });
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        },
    });
};
