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
import { Separator } from "@/components/ui/separator";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";

import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
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
  Pencil,
  Link as LinkIcon,
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

  const queryClient = useQueryClient();

  const { data: debts = [] } = useQuery<any[]>({
    queryKey: ["debts"],
    queryFn: async () => {
      const res = await api.get("/debts/1");
      return res.data;
    }
  });

  const { data: categoriesList = [] } = useQuery<any[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data;
    }
  });

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editRecipient, setEditRecipient] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDebtId, setEditDebtId] = useState<number | null>(null);
  const [editAmount, setEditAmount] = useState(0);
  const [editDate, setEditDate] = useState("");
  const [applyCategoryRule, setApplyCategoryRule] = useState(false);
  const [applyDebtRule, setApplyDebtRule] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleStartEdit = (t: Transaction) => {
    setEditingTransaction(t);
    setEditRecipient(t.recipient);
    setEditCategory(t.category || "Other");
    setEditDebtId((t as any).debt_id || null);
    setEditAmount(t.amount);
    setEditDate(t.date.slice(0, 10));
    setApplyCategoryRule(false);
    setApplyDebtRule(false);
  };

  const handleSaveEdit = async () => {
    if (!editingTransaction) return;
    setIsSaving(true);
    try {
      await api.put(`/transactions/${editingTransaction.id}`, {
        recipient: editRecipient,
        category: editCategory,
        amount: Number(editAmount),
        date: editDate,
        debt_id: editDebtId || null
      }, {
        params: {
          apply_category_rule: applyCategoryRule,
          apply_debt_rule: applyDebtRule
        }
      });
      toast.success("Transaction updated successfully");
      setEditingTransaction(null);
      
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      queryClient.invalidateQueries({ queryKey: ["asset"] });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["statsHistory"] });
      queryClient.invalidateQueries({ queryKey: ["statsCategories"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      refetch();
    } catch (e: any) {
      toast.error(e.response?.data?.detail || "Failed to update transaction.");
    } finally {
      setIsSaving(false);
    }
  };

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
      if (sortField === "date") {
        cmp = a.date.localeCompare(b.date);
        if (cmp === 0) {
          cmp = a.id - b.id; // Secondary sort by ID ascending (sortDir inversion handles desc)
        }
      }
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
                    {items.map((transaction) => {
                      const linkedDebt = debts.find((d: any) => d.id === (transaction as any).debt_id);
                      return (
                        <TableRow
                          key={transaction.id}
                          className="border-border/20 hover:bg-muted/20 transition-colors"
                        >
                          <TableCell className="text-sm text-muted-foreground pl-6">
                            {format(parseISO(transaction.date), "MMM d")}
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{transaction.recipient}</span>
                              {linkedDebt && (
                                <span className="text-[10px] text-primary/70 font-semibold tracking-wide flex items-center gap-1 mt-0.5">
                                  <LinkIcon className="h-2.5 w-2.5" /> Linked to {linkedDebt.name}
                                </span>
                              )}
                            </div>
                          </TableCell>
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
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-40 hover:opacity-100 hover:text-primary transition-all"
                              onClick={() => handleStartEdit(transaction)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-40 hover:opacity-100 hover:text-destructive transition-all"
                              onClick={() => handleDelete(transaction.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ); })}
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
      <Drawer open={!!editingTransaction} onOpenChange={(open) => !open && setEditingTransaction(null)}>
        <DrawerContent className="items-center">
          <div className="w-full max-w-md p-6 space-y-6">
            <DrawerHeader className="p-0">
              <DrawerTitle className="text-center text-xl flex items-center justify-center gap-2">
                <Pencil className="h-5 w-5 text-primary" />
                Edit Transaction
              </DrawerTitle>
              <Separator className="my-4" />
            </DrawerHeader>

            <div className="space-y-4">
              {/* Recipient */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Recipient / Merchant</label>
                <Input
                  value={editRecipient}
                  onChange={(e) => setEditRecipient(e.target.value)}
                  placeholder="Merchant name..."
                  className="bg-background/50 h-9 text-sm w-full"
                />
              </div>

              {/* Amount & Date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Amount ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editAmount}
                    onChange={(e) => setEditAmount(Number(e.target.value))}
                    className="bg-background/50 h-9 text-sm w-full"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Date</label>
                  <Input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="bg-background/50 h-9 text-sm w-full"
                  />
                </div>
              </div>

              {/* Category selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-border bg-background/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {categoriesList.map((cat: any) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                  {!categoriesList.some((c: any) => c.name === editCategory) && (
                    <option value={editCategory}>{editCategory}</option>
                  )}
                </select>
              </div>

              {/* Linked Debt selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">
                  Link to Card / Debt (Payment Flag)
                </label>
                <select
                  value={editDebtId || ""}
                  onChange={(e) => setEditDebtId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full h-9 px-3 rounded-md border border-border bg-background/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">-- No Link (Normal Ledger) --</option>
                  {debts.map((d: any) => (
                    <option key={d.id} value={d.id}>
                      {d.name} (Outstanding: ${d.balance.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Rules check-boxes */}
              <div className="space-y-2 pt-2 border-t border-border/30">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Auto-Categorization Rules</p>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="applyCategoryRule"
                    checked={applyCategoryRule}
                    onChange={(e) => setApplyCategoryRule(e.target.checked)}
                    className="h-4 w-4 rounded border-border bg-background/50 text-primary focus:ring-primary"
                  />
                  <label htmlFor="applyCategoryRule" className="text-xs font-medium text-muted-foreground select-none cursor-pointer">
                    Apply category override to all matches (past & future)
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="applyDebtRule"
                    checked={applyDebtRule}
                    onChange={(e) => setApplyDebtRule(e.target.checked)}
                    className="h-4 w-4 rounded border-border bg-background/50 text-primary focus:ring-primary"
                  />
                  <label htmlFor="applyDebtRule" className="text-xs font-medium text-muted-foreground select-none cursor-pointer">
                    Apply payment flag/link to all matches (past & future)
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingTransaction(null)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </DrawerClose>
              <Button
                size="sm"
                onClick={handleSaveEdit}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
