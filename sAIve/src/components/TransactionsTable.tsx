import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  ChevronRight,
  ChevronLeft,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  SlidersHorizontal,
  Trash2,
  Inbox,
} from "lucide-react";

import { toast } from "sonner";
import { useSettings } from "@/context/SettingsContext";
import { useDeleteTransaction } from "@/hooks/useDeleteTransaction";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isToday, isYesterday, parseISO } from "date-fns";

interface Transaction {
  id: number;
  date: string;
  type: string;
  amount: number;
  recipient: string;
  category?: string;
}

type SortField = "date" | "recipient" | "amount" | "type";
type SortDir = "asc" | "desc";
type TypeFilter = "all" | "income" | "expense";

type TransactionsTableProps = {
  pageSize?: number;
  transactions: Transaction[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
};

// Maps category names to a colour class for the badge
const CATEGORY_COLORS: Record<string, string> = {
  Income: "bg-income/15 text-income border-income/30",
  Food: "bg-orange-500/15 text-orange-400 border-orange-400/30",
  Transportation: "bg-blue-500/15 text-blue-400 border-blue-400/30",
  Subscriptions: "bg-purple-500/15 text-purple-400 border-purple-400/30",
  Bills: "bg-yellow-500/15 text-yellow-400 border-yellow-400/30",
  Housing: "bg-cyan-500/15 text-cyan-400 border-cyan-400/30",
  Other: "bg-muted text-muted-foreground border-border",
};

function formatDayLabel(dateStr: string): string {
  const d = parseISO(dateStr);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "EEEE, MMMM d, yyyy");
}

function SortIcon({ field, sortField, sortDir }: { field: SortField; sortField: SortField; sortDir: SortDir }) {
  if (sortField !== field) return <ArrowUpDown className="h-3.5 w-3.5 ml-1 opacity-40" />;
  return sortDir === "asc"
    ? <ArrowUp className="h-3.5 w-3.5 ml-1 text-primary" />
    : <ArrowDown className="h-3.5 w-3.5 ml-1 text-primary" />;
}

export function TransactionsTable({
  pageSize = 10,
  transactions,
  isLoading,
  isError,
  refetch,
}: TransactionsTableProps) {
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const { formatCurrency } = useSettings();
  const { mutateAsync: deleteTransaction } = useDeleteTransaction();

  const handleDelete = (id: number) => {
    toast.promise(deleteTransaction(id), {
      loading: "Deleting transaction...",
      success: "Transaction deleted successfully",
      error: "Error deleting transaction",
    });
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
    setPage(0);
  };

  // Filter + sort
  const filtered = useMemo(() => {
    let list = [...transactions];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.recipient.toLowerCase().includes(q));
    }

    if (typeFilter !== "all") {
      list = list.filter((t) => t.type === typeFilter);
    }

    const min = parseFloat(minAmount);
    const max = parseFloat(maxAmount);
    if (!isNaN(min)) list = list.filter((t) => t.amount >= min);
    if (!isNaN(max)) list = list.filter((t) => t.amount <= max);

    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === "date") cmp = a.date.localeCompare(b.date);
      else if (sortField === "recipient") cmp = a.recipient.localeCompare(b.recipient);
      else if (sortField === "amount") cmp = a.amount - b.amount;
      else if (sortField === "type") cmp = a.type.localeCompare(b.type);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [transactions, search, typeFilter, minAmount, maxAmount, sortField, sortDir]);

  // Group by date for the current page
  const pageCount = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const groupedByDate = useMemo(() => {
    const groups: { dateKey: string; items: Transaction[] }[] = [];
    const map = new Map<string, Transaction[]>();
    for (const t of paginated) {
      const key = t.date.slice(0, 10);
      if (!map.has(key)) { map.set(key, []); groups.push({ dateKey: key, items: map.get(key)! }); }
      map.get(key)!.push(t);
    }
    return groups;
  }, [paginated]);

  const startIdx = filtered.length === 0 ? 0 : page * pageSize + 1;
  const endIdx = Math.min((page + 1) * pageSize, filtered.length);

  const hasActiveFilters = search || typeFilter !== "all" || minAmount || maxAmount;

  // Loading skeletons
  if (isLoading) {
    return (
      <div className="space-y-2 p-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center py-16 text-muted-foreground gap-2">
        <p className="text-sm font-medium text-destructive">Failed to load transactions.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search recipient…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="pl-8 h-8 text-sm bg-background/50"
          />
        </div>

        {/* Type filter pills */}
        <div className="flex items-center rounded-lg border border-border/50 bg-background/50 p-0.5 gap-0.5">
          {(["all", "income", "expense"] as TypeFilter[]).map((t) => (
            <button
              key={t}
              onClick={() => { setTypeFilter(t); setPage(0); }}
              className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${typeFilter === t
                  ? t === "income"
                    ? "bg-income/20 text-income"
                    : t === "expense"
                      ? "bg-expense/20 text-expense"
                      : "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {t === "all" ? "All" : t}
            </button>
          ))}
        </div>

        {/* Amount range popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`h-8 gap-1.5 text-xs ${minAmount || maxAmount ? "border-primary text-primary" : ""}`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Amount
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3" align="end">
            <p className="text-xs font-medium mb-2 text-muted-foreground">Amount Range</p>
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Min"
                value={minAmount}
                onChange={(e) => { setMinAmount(e.target.value); setPage(0); }}
                className="h-7 text-xs"
              />
              <Input
                type="number"
                placeholder="Max"
                value={maxAmount}
                onChange={(e) => { setMaxAmount(e.target.value); setPage(0); }}
                className="h-7 text-xs"
              />
              {(minAmount || maxAmount) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-6 text-xs text-muted-foreground"
                  onClick={() => { setMinAmount(""); setMaxAmount(""); }}
                >
                  Clear
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Refresh */}
        <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>

      {/* ── Table ── */}
      <div className="rounded-xl border border-border/50 bg-background/30 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30 border-border/40">
              <TableHead
                className="cursor-pointer select-none hover:text-foreground transition-colors"
                onClick={() => toggleSort("date")}
              >
                <span className="flex items-center">Date <SortIcon field="date" sortField={sortField} sortDir={sortDir} /></span>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:text-foreground transition-colors"
                onClick={() => toggleSort("recipient")}
              >
                <span className="flex items-center">Recipient <SortIcon field="recipient" sortField={sortField} sortDir={sortDir} /></span>
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead
                className="cursor-pointer select-none hover:text-foreground transition-colors"
                onClick={() => toggleSort("type")}
              >
                <span className="flex items-center">Type <SortIcon field="type" sortField={sortField} sortDir={sortDir} /></span>
              </TableHead>
              <TableHead
                className="text-right cursor-pointer select-none hover:text-foreground transition-colors"
                onClick={() => toggleSort("amount")}
              >
                <span className="flex items-center justify-end">Amount <SortIcon field="amount" sortField={sortField} sortDir={sortDir} /></span>
              </TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="flex flex-col items-center py-14 gap-3 text-muted-foreground">
                    <Inbox className="h-10 w-10 opacity-20" />
                    <p className="font-medium text-sm">
                      {hasActiveFilters ? "No transactions match your filters." : "No transactions yet."}
                    </p>
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setSearch(""); setTypeFilter("all"); setMinAmount(""); setMaxAmount(""); }}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              groupedByDate.map(({ dateKey, items }) => {
                // Compute per-day net
                const dayNet = items.reduce((acc, t) => {
                  return t.type === "income" ? acc + t.amount : acc - t.amount;
                }, 0);

                return (
                  <>
                    {/* Day header row */}
                    <TableRow key={`header-${dateKey}`} className="bg-muted/20 hover:bg-muted/20 border-border/20">
                      <TableCell colSpan={4} className="py-1.5 px-4">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {formatDayLabel(dateKey)}
                        </span>
                      </TableCell>
                      <TableCell className="py-1.5 text-right pr-4">
                        <span className={`text-xs font-semibold ${dayNet >= 0 ? "text-income" : "text-expense"}`}>
                          {dayNet >= 0 ? "+" : "−"}{formatCurrency(Math.abs(dayNet))}
                        </span>
                      </TableCell>
                      <TableCell className="py-1.5" />
                    </TableRow>

                    {/* Transaction rows */}
                    {items.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        className="border-border/20 hover:bg-muted/20 transition-colors"
                      >
                        <TableCell className="text-sm text-muted-foreground pl-6">
                          {format(parseISO(transaction.date), "MMM d")}
                        </TableCell>
                        <TableCell className="font-medium">{transaction.recipient}</TableCell>
                        <TableCell>
                          {transaction.category ? (
                            <Badge
                              variant="outline"
                              className={`text-xs px-2 py-0.5 ${CATEGORY_COLORS[transaction.category] ?? CATEGORY_COLORS["Other"]}`}
                            >
                              {transaction.category}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {transaction.type === "income" ? (
                            <span className="flex items-center gap-1.5 text-income text-sm capitalize">
                              <TrendingUp className="h-3.5 w-3.5" /> Income
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-expense text-sm capitalize">
                              <TrendingDown className="h-3.5 w-3.5" /> Expense
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          <span className={transaction.type === "income" ? "text-income" : "text-expense"}>
                            {transaction.type === "income" ? "+" : "−"}{formatCurrency(Number(transaction.amount.toFixed(2)))}
                          </span>
                        </TableCell>
                        <TableCell className="pr-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-40 hover:opacity-100 hover:text-destructive transition-all"
                            onClick={() => handleDelete(transaction.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination ── */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="text-xs">
            Showing {startIdx}–{endIdx} of {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs px-1">
              {page + 1} / {pageCount}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setPage((p) => Math.min(p + 1, pageCount - 1))}
              disabled={page >= pageCount - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
