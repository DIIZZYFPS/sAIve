import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

/**
 * Maps each backend event type to the TanStack Query keys it should invalidate.
 * Keep this in sync with sse_bus.py emit_event call-sites.
 */
const EVENT_QUERY_MAP: Record<string, string[][]> = {
    transactions_changed: [
        ["transactions"],
        ["assets"],
        ["asset"],
        ["categories"],
        ["statsCategories"],
        ["statsHistory"],
        ["categoryHistory"],
        ["dailySpending"],
        ["userProfile"],
        ["sankey"],
    ],
    budgets_changed: [["budgets"]],
    recurring_changed: [["recurring_transactions"]],
    notifications_changed: [["notifications"]],
    debts_changed: [["debts"]],
};

/**
 * Opens a persistent SSE connection to /events/{userId}.
 * When the backend emits an event, the matching query keys are invalidated
 * causing TanStack Query to refetch stale data automatically.
 *
 * EventSource reconnects automatically on network errors — no manual retry needed.
 */
export function useServerEvents(userId: number) {
    const queryClient = useQueryClient();

    useEffect(() => {
        const baseUrl = (api.defaults.baseURL ?? "http://localhost:8000").replace(/\/$/, "");
        const url = `${baseUrl}/events/${userId}`;

        const es = new EventSource(url);

        es.onmessage = (event) => {
            try {
                const { type } = JSON.parse(event.data) as { type: string; user_id: number };
                const keys = EVENT_QUERY_MAP[type] ?? [];
                keys.forEach((queryKey) =>
                    queryClient.invalidateQueries({ queryKey })
                );
            } catch {
                // Ignore malformed events (e.g. heartbeat comments have no data)
            }
        };

        es.onerror = () => {
            // EventSource handles reconnection internally.
            // We intentionally DO NOT close here so it can recover.
        };

        return () => {
            es.close();
        };
    }, [userId, queryClient]);
}
