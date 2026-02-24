import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { RefreshCw, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function RecurringTable() {
    const { formatCurrency } = useSettings();
    const queryClient = useQueryClient();

    const [editingRt, setEditingRt] = useState<any>(null);

    const { data: recurringTxns = [], isLoading, isError } = useQuery({
        queryKey: ['recurring_transactions'],
        queryFn: async () => {
            const response = await api.get("/recurring_transactions/1"); // Assuming user_id 1
            return response.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/recurring_transactions/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recurring_transactions"] });
            toast.success("Subscription cancelled successfully");
        },
        onError: () => toast.error("Failed to cancel subscription"),
    });

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to cancel the recurring transaction: ${name}?`)) {
            deleteMutation.mutate(id);
        }
    };

    const updateMutation = useMutation({
        mutationFn: (rt: any) => api.put(`/recurring_transactions/${rt.id}`, rt),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recurring_transactions"] });
            toast.success("Subscription updated successfully");
            setEditingRt(null);
        },
        onError: () => toast.error("Failed to update subscription"),
    });

    const handleSaveEdit = () => {
        if (!editingRt) return;
        updateMutation.mutate(editingRt);
    };

    if (isLoading) return <div className="space-y-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>;
    if (isError) return <div className="text-red-500">Failed to load recurring transactions.</div>;

    return (
        <Card className="glass-card border-border/50 animate-fade-in shadow-xl">
            <CardHeader className="pb-4 border-b border-border/30 mb-4 bg-background/20 rounded-t-xl">
                <CardTitle className="text-xl flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-primary" /> Active Subscriptions
                </CardTitle>
                <CardDescription>
                    These transactions are automatically added to your ledger on their interval dates.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {recurringTxns.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground w-full flex flex-col items-center bg-background/30 rounded-lg border border-dashed border-border/50">
                        <RefreshCw className="h-10 w-10 mb-4 opacity-20" />
                        <p className="font-medium text-foreground">No active subscriptions detected.</p>
                        <p className="text-sm mt-1">Create one using the 'Add Transaction' button.</p>
                    </div>
                ) : (
                    <div className="rounded-md border border-border/50 bg-background/50 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50 hover:bg-muted/50">
                                <TableRow className="border-border/50 border-b">
                                    <TableHead className="h-12 border-r border-border/30 last:border-r-0">Recipient</TableHead>
                                    <TableHead className="h-12 border-r border-border/30 last:border-r-0">Amount</TableHead>
                                    <TableHead className="h-12 border-r border-border/30 last:border-r-0">Category</TableHead>
                                    <TableHead className="h-12 border-r border-border/30 last:border-r-0">Interval</TableHead>
                                    <TableHead className="h-12 border-r border-border/30 last:border-r-0">Next Date</TableHead>
                                    <TableHead className="h-12 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recurringTxns.map((rt: any) => (
                                    <TableRow key={rt.id} className="border-border/30 last:border-0 hover:bg-muted/30 transition-colors">
                                        <TableCell className="font-medium border-r border-border/30 last:border-r-0">{rt.recipient}</TableCell>
                                        <TableCell className={`border-r border-border/30 last:border-r-0 font-semibold ${rt.type === 'expense' ? 'text-red-400' : 'text-emerald-400'}`}>
                                            {rt.type === 'expense' ? '-' : '+'}{formatCurrency(rt.amount)}
                                        </TableCell>
                                        <TableCell className="border-r border-border/30 last:border-r-0">
                                            <Badge variant="outline" className="text-xs bg-background/80 shadow-sm border-border/60">{rt.category}</Badge>
                                        </TableCell>
                                        <TableCell className="capitalize text-muted-foreground border-r border-border/30 last:border-r-0">
                                            {rt.interval}
                                        </TableCell>
                                        <TableCell className="border-r border-border/30 last:border-r-0">
                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md bg-primary/10 text-primary whitespace-nowrap">
                                                {format(parseISO(rt.next_date), "MMM d, yyyy")}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-primary hover:bg-primary/10 transition-colors"
                                                onClick={() => setEditingRt({ ...rt })}
                                                title="Edit Subscription"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                                                onClick={() => handleDelete(rt.id, rt.recipient)}
                                                disabled={deleteMutation.isPending}
                                                title="Cancel Subscription"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>

            <Dialog open={!!editingRt} onOpenChange={(open) => !open && setEditingRt(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Subscription</DialogTitle>
                    </DialogHeader>
                    {editingRt && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Recipient / Title</Label>
                                <Input
                                    value={editingRt.recipient}
                                    onChange={(e) => setEditingRt({ ...editingRt, recipient: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Amount</Label>
                                <Input
                                    type="number"
                                    value={editingRt.amount}
                                    onChange={(e) => setEditingRt({ ...editingRt, amount: parseFloat(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Select
                                        value={editingRt.type}
                                        onValueChange={(val) => setEditingRt({ ...editingRt, type: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="expense">Expense</SelectItem>
                                            <SelectItem value="income">Income</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Interval</Label>
                                    <Select
                                        value={editingRt.interval}
                                        onValueChange={(val) => setEditingRt({ ...editingRt, interval: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="daily">Daily</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                            <SelectItem value="yearly">Yearly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingRt(null)}>Cancel</Button>
                        <Button onClick={handleSaveEdit} disabled={updateMutation.isPending}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
