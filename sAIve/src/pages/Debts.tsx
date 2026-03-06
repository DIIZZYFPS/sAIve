import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSettings } from "@/context/SettingsContext";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
} from "@/components/ui/drawer";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    Landmark,
    Car,
    Home,
    GraduationCap,
    CreditCard,
    MoreVertical,
    Pencil,
    Trash2,
    Plus,
    TrendingDown,
    Wallet,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Debt {
    id: number;
    user_id: number;
    name: string;
    type: string;
    balance: number;
    total_amount: number;
    interest_rate: number;
    monthly_payment: number;
    start_date: string | null;
}

type DebtType = "auto" | "credit_card" | "student" | "mortgage" | "personal";

const DEBT_TYPE_META: Record<DebtType, { label: string; icon: React.ElementType; color: string }> = {
    auto: { label: "Auto Loan", icon: Car, color: "#2dd4bf" },
    credit_card: { label: "Credit Card", icon: CreditCard, color: "#ec4899" },
    student: { label: "Student Loan", icon: GraduationCap, color: "#6366f1" },
    mortgage: { label: "Mortgage", icon: Home, color: "#f59e0b" },
    personal: { label: "Personal Loan", icon: Landmark, color: "#8b5cf6" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function estimatePayoffMonths(balance: number, rate: number, monthly: number): number | null {
    if (monthly <= 0) return null;
    if (rate <= 0) {
        return Math.ceil(balance / monthly);
    }
    const r = rate / 100 / 12;
    if (monthly <= balance * r) return null; // Payment doesn't cover interest
    return Math.ceil(-Math.log(1 - (balance * r) / monthly) / Math.log(1 + r));
}

function buildPayoffData(debt: Debt): { month: string; balance: number }[] {
    const months = estimatePayoffMonths(debt.balance, debt.interest_rate, debt.monthly_payment);
    if (!months || months > 480) return [];
    const r = debt.interest_rate / 100 / 12;
    const data: { month: string; balance: number }[] = [];
    let bal = debt.balance;
    const now = new Date();
    for (let i = 0; i <= Math.min(months, 120); i++) {
        const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
        data.push({
            month: `${d.toLocaleString("default", { month: "short" })} '${String(d.getFullYear()).slice(2)}`,
            balance: Math.max(Math.round(bal), 0),
        });
        const interest = bal * r;
        bal = bal + interest - debt.monthly_payment;
        if (bal <= 0) break;
    }
    return data;
}

// ── Debt Card ─────────────────────────────────────────────────────────────────

function DebtCard({
    debt,
    formatCurrency,
    onEdit,
    onDelete,
    onPay,
}: {
    debt: Debt;
    formatCurrency: (n: number) => string;
    onEdit: (d: Debt) => void;
    onDelete: (d: Debt) => void;
    onPay: (d: Debt) => void;
}) {
    const meta = DEBT_TYPE_META[debt.type as DebtType] ?? DEBT_TYPE_META.personal;
    const Icon = meta.icon;
    const pct = debt.total_amount > 0 ? Math.min(((debt.total_amount - debt.balance) / debt.total_amount) * 100, 100) : 0;
    const payoffMonths = estimatePayoffMonths(debt.balance, debt.interest_rate, debt.monthly_payment);

    const formatMonths = (m: number | null) => {
        if (m === null) return "—";
        if (m < 12) return `${m}mo`;
        const y = Math.floor(m / 12);
        const rem = m % 12;
        return rem > 0 ? `${y}y ${rem}mo` : `${y}y`;
    };

    return (
        <Card className="border-border/50 relative overflow-hidden">
            {/* Accent stripe */}
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ backgroundColor: meta.color }} />

            <CardContent className="p-5 pl-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${meta.color}22` }}>
                            <Icon className="h-5 w-5" style={{ color: meta.color }} />
                        </div>
                        <div>
                            <p className="font-semibold text-sm">{debt.name}</p>
                            <p className="text-xs text-muted-foreground">{meta.label}</p>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(debt)}>
                                <Pencil className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onPay(debt)}>
                                <Wallet className="h-4 w-4 mr-2" /> Make Payment
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => onDelete(debt)}
                            >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Balance + progress */}
                <div className="mb-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Remaining</span>
                        <span>{pct.toFixed(0)}% paid off</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, backgroundColor: meta.color }}
                        />
                    </div>
                    <div className="flex justify-between mt-1.5">
                        <span className="text-lg font-bold text-expense">{formatCurrency(debt.balance)}</span>
                        <span className="text-xs text-muted-foreground self-end mb-0.5">of {formatCurrency(debt.total_amount)}</span>
                    </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-muted/40 rounded-lg py-1.5 px-2">
                        <p className="text-xs text-muted-foreground">Monthly</p>
                        <p className="text-xs font-semibold">{debt.monthly_payment > 0 ? formatCurrency(debt.monthly_payment) : "—"}</p>
                    </div>
                    <div className="bg-muted/40 rounded-lg py-1.5 px-2">
                        <p className="text-xs text-muted-foreground">APR</p>
                        <p className="text-xs font-semibold">{debt.interest_rate > 0 ? `${debt.interest_rate}%` : "—"}</p>
                    </div>
                    <div className="bg-muted/40 rounded-lg py-1.5 px-2">
                        <p className="text-xs text-muted-foreground">Payoff</p>
                        <p className="text-xs font-semibold">{formatMonths(payoffMonths)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// ── Debt Form Drawer ─────────────────────────────────────────────────────────

const EMPTY_FORM = {
    name: "",
    type: "credit_card" as DebtType,
    balance: "",
    total_amount: "",
    interest_rate: "",
    monthly_payment: "",
};

function DebtDrawer({
    open,
    onOpenChange,
    initial,
    onSave,
    saving,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    initial?: Debt | null;
    onSave: (data: typeof EMPTY_FORM) => void;
    saving: boolean;
}) {
    const [form, setForm] = useState({
        ...EMPTY_FORM, ...(initial ? {
            name: initial.name,
            type: initial.type as DebtType,
            balance: String(initial.balance),
            total_amount: String(initial.total_amount),
            interest_rate: String(initial.interest_rate),
            monthly_payment: String(initial.monthly_payment),
        } : {})
    });

    // Reset when initial changes
    useMemo(() => {
        setForm({
            ...EMPTY_FORM, ...(initial ? {
                name: initial.name,
                type: initial.type as DebtType,
                balance: String(initial.balance),
                total_amount: String(initial.total_amount),
                interest_rate: String(initial.interest_rate),
                monthly_payment: String(initial.monthly_payment),
            } : {})
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initial?.id, open]);

    const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="items-center">
                <DrawerHeader className="text-center">
                    <DrawerTitle>{initial ? "Edit Debt" : "Add Debt"}</DrawerTitle>
                    <DrawerDescription>
                        {initial ? "Update the details for this debt." : "Track a liability that affects your net worth."}
                    </DrawerDescription>
                </DrawerHeader>

                <form onSubmit={handleSubmit} className="w-full max-w-2xl px-6 pb-2 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-1.5">
                            <Label htmlFor="debt-name">Name</Label>
                            <Input
                                id="debt-name"
                                placeholder='e.g. "2024 Honda Civic" or "Chase Sapphire"'
                                value={form.name}
                                onChange={e => set("name", e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-span-2 space-y-1.5">
                            <Label htmlFor="debt-type">Type</Label>
                            <Select value={form.type} onValueChange={v => set("type", v as DebtType)}>
                                <SelectTrigger id="debt-type">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(DEBT_TYPE_META).map(([k, v]) => (
                                        <SelectItem key={k} value={k}>{v.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="debt-balance">Current Balance ($)</Label>
                            <Input id="debt-balance" type="number" min="0" step="0.01" placeholder="21000"
                                value={form.balance} onChange={e => set("balance", e.target.value)} required />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="debt-total">Original Amount ($)</Label>
                            <Input id="debt-total" type="number" min="0" step="0.01" placeholder="21000"
                                value={form.total_amount} onChange={e => set("total_amount", e.target.value)} required />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="debt-rate">APR (%)</Label>
                            <Input id="debt-rate" type="number" min="0" step="0.01" placeholder="6.9"
                                value={form.interest_rate} onChange={e => set("interest_rate", e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="debt-payment">Monthly Payment ($)</Label>
                            <Input id="debt-payment" type="number" min="0" step="0.01" placeholder="350"
                                value={form.monthly_payment} onChange={e => set("monthly_payment", e.target.value)} />
                        </div>
                    </div>

                    <DrawerFooter className="px-0 pt-2 flex-row justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving ? "Saving…" : initial ? "Save Changes" : "Add Debt"}
                        </Button>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    );
}

// ── Payment Drawer ────────────────────────────────────────────────────────────

function PaymentDrawer({
    open,
    onOpenChange,
    debt,
    onPay,
    saving,
    formatCurrency,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    debt: Debt | null;
    onPay: (amount: number) => void;
    saving: boolean;
    formatCurrency: (n: number) => string;
}) {
    const [amount, setAmount] = useState("");

    useMemo(() => { setAmount(debt ? String(debt.monthly_payment || "") : ""); }, [debt?.id, open]);

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="items-center">
                <DrawerHeader className="text-center">
                    <DrawerTitle>Make a Payment</DrawerTitle>
                    <DrawerDescription>
                        {debt ? `Reduce the balance on "${debt.name}"` : ""}
                    </DrawerDescription>
                </DrawerHeader>
                {debt && (
                    <div className="w-full max-w-md px-6 pb-2 space-y-5">
                        <div className="bg-muted/40 rounded-xl p-4 flex justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">Current Balance</p>
                                <p className="text-xl font-bold text-expense">{formatCurrency(debt.balance)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Scheduled Payment</p>
                                <p className="text-xl font-bold">{debt.monthly_payment > 0 ? formatCurrency(debt.monthly_payment) : "—"}</p>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="payment-amount">Payment Amount ($)</Label>
                            <Input
                                id="payment-amount"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <DrawerFooter className="px-0 pt-2 flex-row justify-end gap-2">
                            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button
                                disabled={saving || !amount || parseFloat(amount) <= 0}
                                onClick={() => onPay(parseFloat(amount))}
                            >
                                {saving ? "Processing…" : "Apply Payment"}
                            </Button>
                        </DrawerFooter>
                    </div>
                )}
            </DrawerContent>
        </Drawer>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const Debts = () => {
    const { formatCurrency } = useSettings();
    const queryClient = useQueryClient();

    const [sheetOpen, setSheetOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Debt | null>(null);
    const [payTarget, setPayTarget] = useState<Debt | null>(null);
    const [paySheetOpen, setPaySheetOpen] = useState(false);

    const { data: debts = [], isLoading } = useQuery<Debt[]>({
        queryKey: ["debts"],
        queryFn: async () => (await api.get("/debts/1")).data,
    });

    const { data: asset } = useQuery({
        queryKey: ["asset"],
        queryFn: async () => (await api.get("/user_asset/1")).data,
    });

    // Summary stats
    const totalBalance = useMemo(() => debts.reduce((s, d) => s + d.balance, 0), [debts]);
    const totalMonthly = useMemo(() => debts.reduce((s, d) => s + d.monthly_payment, 0), [debts]);
    const monthlyIncome: number = asset?.asset?.TIncome ?? 0;
    const dti = monthlyIncome > 0 ? (totalMonthly / monthlyIncome) * 100 : 0;

    // Payoff chart — combine all debts' projections
    const chartData = useMemo(() => {
        if (debts.length === 0) return [];
        const allSets = debts.map(d => buildPayoffData(d));
        const maxLen = Math.max(...allSets.map(s => s.length));
        if (maxLen === 0) return [];
        return Array.from({ length: maxLen }, (_, i) => {
            const entry: Record<string, string | number> = { month: allSets.find(s => s[i])![i].month };
            debts.forEach((d, j) => {
                entry[d.name] = allSets[j][i]?.balance ?? 0;
            });
            return entry;
        });
    }, [debts]);

    const CHART_COLORS = ["#f43f5e", "#2dd4bf", "#6366f1", "#f59e0b", "#ec4899"];

    // Mutations
    const createMut = useMutation({
        mutationFn: (body: object) => api.post("/debts/1", body),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["debts"] }); queryClient.invalidateQueries({ queryKey: ["asset"] }); queryClient.invalidateQueries({ queryKey: ["userProfile"] }); setSheetOpen(false); toast.success("Debt added"); },
        onError: () => toast.error("Failed to add debt"),
    });

    const updateMut = useMutation({
        mutationFn: ({ id, body }: { id: number; body: object }) => api.put(`/debts/${id}`, body),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["debts"] }); queryClient.invalidateQueries({ queryKey: ["asset"] }); queryClient.invalidateQueries({ queryKey: ["userProfile"] }); setSheetOpen(false); setEditTarget(null); toast.success("Debt updated"); },
        onError: () => toast.error("Failed to update debt"),
    });

    const deleteMut = useMutation({
        mutationFn: (id: number) => api.delete(`/debts/${id}`),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["debts"] }); queryClient.invalidateQueries({ queryKey: ["asset"] }); queryClient.invalidateQueries({ queryKey: ["userProfile"] }); toast.success("Debt removed"); },
        onError: () => toast.error("Failed to delete debt"),
    });

    const payMut = useMutation({
        mutationFn: ({ id, balance }: { id: number; balance: number }) =>
            api.patch(`/debts/${id}/balance`, { balance }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["debts"] });
            queryClient.invalidateQueries({ queryKey: ["asset"] });
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
            setPaySheetOpen(false);
            setPayTarget(null);
            toast.success("Payment applied — balance updated");
        },
        onError: () => toast.error("Failed to apply payment"),
    });

    const handleSave = (form: typeof EMPTY_FORM) => {
        const body = {
            user_id: 1,
            name: form.name,
            type: form.type,
            balance: parseFloat(form.balance) || 0,
            total_amount: parseFloat(form.total_amount) || parseFloat(form.balance) || 0,
            interest_rate: parseFloat(form.interest_rate) || 0,
            monthly_payment: parseFloat(form.monthly_payment) || 0,
        };
        if (editTarget) {
            updateMut.mutate({ id: editTarget.id, body });
        } else {
            createMut.mutate(body);
        }
    };

    const handlePay = (amount: number) => {
        if (!payTarget) return;
        const newBalance = Math.max(payTarget.balance - amount, 0);
        payMut.mutate({ id: payTarget.id, balance: newBalance });
    };

    const handleEdit = (d: Debt) => { setEditTarget(d); setSheetOpen(true); };
    const handleDelete = (d: Debt) => {
        if (window.confirm(`Delete "${d.name}"? This cannot be undone.`)) {
            deleteMut.mutate(d.id);
        }
    };
    const handlePay_ = (d: Debt) => { setPayTarget(d); setPaySheetOpen(true); };

    const dtiColor = dti > 43 ? "text-expense" : dti > 28 ? "text-yellow-500" : "text-income";

    return (
        <>
            <DashboardHeader pageName="Debts & Liabilities" />
            <main className="flex-1 p-6 overflow-auto space-y-6">

                {/* Summary bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border-border/50">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Total Owed</p>
                                <p className="text-xl font-bold text-expense">{formatCurrency(totalBalance)}</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-expense/10">
                                <TrendingDown className="h-5 w-5 text-expense" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border/50">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Active Debts</p>
                                <p className="text-xl font-bold">{debts.length}</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-primary/10">
                                <Landmark className="h-5 w-5 text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border/50">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Monthly Obligations</p>
                                <p className="text-xl font-bold">{formatCurrency(totalMonthly)}</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-saving/10">
                                <Wallet className="h-5 w-5 text-saving" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border/50">
                        <CardContent className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Debt-to-Income</p>
                                <p className={cn("text-xl font-bold", dtiColor)}>
                                    {monthlyIncome > 0 ? `${dti.toFixed(1)}%` : "—"}
                                </p>
                                {dti > 43 && <p className="text-xs text-expense mt-0.5">High — aim for &lt;36%</p>}
                                {dti > 0 && dti <= 28 && <p className="text-xs text-income mt-0.5">Healthy</p>}
                            </div>
                            <div className={cn("p-2.5 rounded-xl", dti > 43 ? "bg-expense/10" : "bg-income/10")}>
                                {dti > 43
                                    ? <AlertCircle className="h-5 w-5 text-expense" />
                                    : <CheckCircle2 className="h-5 w-5 text-income" />
                                }
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Your Debts</h2>
                    <Button size="sm" onClick={() => { setEditTarget(null); setSheetOpen(true); }}>
                        <Plus className="h-4 w-4 mr-1.5" /> Add Debt
                    </Button>
                </div>

                {/* Debt cards */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                            <Card key={i} className="border-border/50 animate-pulse">
                                <CardContent className="p-5 h-[200px]" />
                            </Card>
                        ))}
                    </div>
                ) : debts.length === 0 ? (
                    <Card className="border-border/50 border-dashed">
                        <CardContent className="p-12 text-center">
                            <Landmark className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                            <p className="font-medium text-muted-foreground">No debts tracked yet</p>
                            <p className="text-sm text-muted-foreground/60 mt-1 mb-4">
                                Add a loan or credit card to see how it affects your net worth
                            </p>
                            <Button size="sm" onClick={() => { setEditTarget(null); setSheetOpen(true); }}>
                                <Plus className="h-4 w-4 mr-1.5" /> Add your first debt
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {debts.map(d => (
                            <DebtCard
                                key={d.id}
                                debt={d}
                                formatCurrency={formatCurrency}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onPay={handlePay_}
                            />
                        ))}
                    </div>
                )}

                {/* Payoff projection chart */}
                {chartData.length > 1 && (
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="text-base">Payoff Projection</CardTitle>
                            <CardDescription className="text-xs">
                                Estimated balance over time at current payment rates
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={260}>
                                <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                                        tickLine={false}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis
                                        tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                                    />
                                    <Tooltip
                                        formatter={(value) => formatCurrency(Number(value))}
                                        contentStyle={{
                                            backgroundColor: "var(--card)",
                                            border: "1px solid var(--border)",
                                            borderRadius: "0.5rem",
                                            fontSize: "12px",
                                        }}
                                    />
                                    {debts.length > 1 && <Legend wrapperStyle={{ fontSize: 11 }} />}
                                    {debts.map((d, i) => (
                                        <Line
                                            key={d.id}
                                            type="monotone"
                                            dataKey={d.name}
                                            stroke={CHART_COLORS[i % CHART_COLORS.length]}
                                            strokeWidth={2}
                                            dot={false}
                                            activeDot={{ r: 4 }}
                                        />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}
            </main>

            {/* Add / Edit Drawer */}
            <DebtDrawer
                open={sheetOpen}
                onOpenChange={v => { setSheetOpen(v); if (!v) setEditTarget(null); }}
                initial={editTarget}
                onSave={handleSave}
                saving={createMut.isPending || updateMut.isPending}
            />

            {/* Payment Drawer */}
            <PaymentDrawer
                open={paySheetOpen}
                onOpenChange={v => { setPaySheetOpen(v); if (!v) setPayTarget(null); }}
                debt={payTarget}
                onPay={handlePay}
                saving={payMut.isPending}
                formatCurrency={formatCurrency}
            />
        </>
    );
};

export default Debts;
