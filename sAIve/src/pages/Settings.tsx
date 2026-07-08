import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/ThemeProvider";
import { useSettings, CURRENCIES, AI_MODELS, type CurrencyCode, type AiModelId } from "@/context/SettingsContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";
import { Sun, Moon, Monitor, User, Download, Save, Coins, Bot, Landmark, Trash2, Plus, RefreshCw, ShieldAlert, Palette, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { usePlaidLink } from "react-plaid-link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Settings = () => {
    const { mode, setMode, colorTheme, setColorTheme } = useTheme();
    const { currency, setCurrency, aiEnabled, setAiEnabled, aiModel, setAiModel, formatCurrency } = useSettings();
    const queryClient = useQueryClient();

    // Fetch user profile
    const { data: userData, isLoading } = useQuery({
        queryKey: ["userProfile"],
        queryFn: async () => {
            const response = await api.get("/users/1");
            return response.data;
        },
    });

    const [name, setName] = useState("");
    const [nameLoaded, setNameLoaded] = useState(false);

    // Sync name from server once
    if (userData && !nameLoaded) {
        setName(userData.name || "");
        setNameLoaded(true);
    }

    // Update user name
    const updateName = useMutation({
        mutationFn: async (newName: string) => {
            await api.put("/users/1", { id: 1, name: newName, net_worth: userData?.net_worth ?? 0 });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
            toast.success("Profile updated!");
        },
        onError: () => {
            toast.error("Failed to update profile");
        },
    });

    // Plaid states
    const [plaidConfigured, setPlaidConfigured] = useState(false);
    const [plaidClientId, setPlaidClientId] = useState("");
    const [plaidSecret, setPlaidSecret] = useState("");
    const [plaidEnv, setPlaidEnv] = useState("sandbox");
    const [linkToken, setLinkToken] = useState<string | null>(null);
    const [plaidError, setPlaidError] = useState("");
    const [isSavingPlaidKeys, setIsSavingPlaidKeys] = useState(false);
    const [isLinking, setIsLinking] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [showKeyForm, setShowKeyForm] = useState(false);

    // Custom Categories states
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryColor, setNewCategoryColor] = useState("blue");

    const isElectron = !!(window as any).electronAPI;

    // Query: Check Plaid config
    const { refetch: refetchPlaidConfig } = useQuery({
        queryKey: ["plaidConfig"],
        queryFn: async () => {
            if (!isElectron) return { is_configured: false, env: "sandbox" };
            const res = await api.get("/plaid/config");
            if (res.data.is_configured) {
                setPlaidConfigured(true);
                try {
                    const tokenRes = await api.post("/plaid/create_link_token");
                    setLinkToken(tokenRes.data.link_token);
                } catch (e) {
                    console.error("Failed to generate link token:", e);
                }
            }
            return res.data;
        },
        enabled: isElectron
    });

    // Query: Plaid Accounts
    const { data: plaidAccounts = [], refetch: refetchPlaidAccounts } = useQuery({
        queryKey: ["plaidAccounts"],
        queryFn: async () => {
            if (!isElectron) return [];
            const res = await api.get("/plaid/accounts");
            return res.data;
        },
        enabled: isElectron
    });

    // Query: Dynamic Categories
    const { data: categories = [], refetch: refetchCategories } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await api.get("/categories");
            return res.data;
        }
    });

    const handleSavePlaidKeysInSettings = async () => {
        if (!plaidClientId || !plaidSecret) {
            toast.error("Both keys are required.");
            return;
        }
        setIsSavingPlaidKeys(true);
        setPlaidError("");
        try {
            await api.post("/plaid/config", {
                client_id: plaidClientId,
                secret: plaidSecret,
                env: plaidEnv
            });
            toast.success("Plaid configurations updated!");
            setPlaidConfigured(true);
            setShowKeyForm(false);
            refetchPlaidConfig();
        } catch (e: any) {
            setPlaidError(e.response?.data?.detail || "Failed to update configuration.");
            toast.error("Failed to save credentials.");
        } finally {
            setIsSavingPlaidKeys(false);
        }
    };

    const handleSyncPlaidSettings = async () => {
        setIsSyncing(true);
        try {
            const res = await api.post("/plaid/sync");
            toast.success(`Sync complete! Synced bank accounts, imported ${res.data.transactions_added} new transactions.`);
            refetchPlaidAccounts();
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        } catch (e: any) {
            toast.error(e.response?.data?.detail || "Transaction sync failed.");
        } finally {
            setIsSyncing(false);
        }
    };

    const handleRemoveBankItem = async (itemId: string) => {
        const message = "Are you sure you want to unlink this bank?";
        const detail = "This will delete all linked sub-accounts and all transactions imported from this bank connection. This action cannot be undone.";
        
        let confirmed = false;
        const electronAPI = (window as any).electronAPI;
        if (electronAPI?.showConfirmDialog) {
            confirmed = await electronAPI.showConfirmDialog({ message, detail });
        } else {
            confirmed = window.confirm(`${message}\n\n${detail}`);
        }
        if (!confirmed) return;
        try {
            await api.delete(`/plaid/item/${itemId}`);
            toast.success("Bank link removed.");
            refetchPlaidAccounts();
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        } catch (err: any) {
            toast.error(err.response?.data?.detail || "Failed to remove bank connection.");
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        try {
            await api.post("/categories", { name: newCategoryName.trim(), color: newCategoryColor });
            toast.success(`Category "${newCategoryName.trim()}" created!`);
            setNewCategoryName("");
            refetchCategories();
        } catch (e: any) {
            toast.error(e.response?.data?.detail || "Failed to add category.");
        }
    };

    const handleDeleteCategory = async (name: string) => {
        if (["Housing", "Food", "Transportation", "Subscriptions", "Bills", "Income", "Other"].includes(name)) {
            toast.error("Default categories cannot be deleted.");
            return;
        }
        try {
            await api.delete(`/categories/${name}`);
            toast.success(`Category "${name}" deleted.`);
            refetchCategories();
        } catch (e: any) {
            toast.error(e.response?.data?.detail || "Failed to delete category.");
        }
    };

    const { open, ready } = usePlaidLink({
        token: linkToken || "",
        onSuccess: async (public_token) => {
            setIsLinking(true);
            try {
                const res = await api.post("/plaid/exchange_public_token", { public_token });
                toast.success(`Linked to ${res.data.institution_name}!`);
                refetchPlaidAccounts();
                queryClient.invalidateQueries({ queryKey: ["transactions"] });
                queryClient.invalidateQueries({ queryKey: ["userProfile"] });
                queryClient.invalidateQueries({ queryKey: ["asset"] });
                queryClient.invalidateQueries({ queryKey: ["assets"] });
                queryClient.invalidateQueries({ queryKey: ["statsHistory"] });
                queryClient.invalidateQueries({ queryKey: ["statsCategories"] });
                queryClient.invalidateQueries({ queryKey: ["categoryHistory"] });
                queryClient.invalidateQueries({ queryKey: ["dailySpending"] });
            } catch (err: any) {
                toast.error(err.response?.data?.detail || "Bank connection exchange failed.");
            } finally {
                setIsLinking(false);
            }
        }
    });


    // Export data
    const handleExport = async () => {
        try {
            const [transactions, assets] = await Promise.all([
                api.get("/transactions/"),
                api.get("/user_assets/1/all"),
            ]);
            const exportData = {
                exportDate: format(new Date(), "yyyy-MM-dd"),
                transactions: transactions.data,
                assets: assets.data,
            };
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `saive-export-${format(new Date(), "yyyy-MM-dd")}.json`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("Data exported successfully!");
        } catch {
            toast.error("Export failed");
        }
    };

    const modeOptions = [
        { value: "light" as const, label: "Light", icon: Sun },
        { value: "dark" as const, label: "Dark", icon: Moon },
        { value: "system" as const, label: "System", icon: Monitor },
    ];

    const colorThemeOptions = [
        { value: "theme-dynamic" as const, label: "Dynamic (Default)", colorClass: "bg-red-500" },
        { value: "theme-mint" as const, label: "Cyber Mint", colorClass: "bg-teal-500" },
        { value: "theme-emerald" as const, label: "Deep Emerald", colorClass: "bg-emerald-500" },
    ];

    return (
        <>
            <DashboardHeader pageName="Settings" />
            <main className="flex-1 p-6 overflow-auto">
                <div className="max-w-2xl mx-auto space-y-6">

                    {/* Appearance */}
                    <Card className="glass-card border-border/50">
                        <CardHeader>
                            <CardTitle className="text-lg">Appearance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Mode Selection */}
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground font-medium">Display Mode</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {modeOptions.map(({ value, label, icon: Icon }) => (
                                        <button
                                            key={value}
                                            onClick={() => setMode(value)}
                                            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all cursor-pointer ${mode === value
                                                ? "border-primary bg-primary/10"
                                                : "border-border hover:border-primary/40 hover:bg-muted/50"
                                                }`}
                                        >
                                            <Icon className="h-6 w-6" />
                                            <span className="text-sm font-medium">{label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            {/* Color Theme Selection */}
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground font-medium">Color Theme</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {colorThemeOptions.map(({ value, label, colorClass }) => (
                                        <button
                                            key={value}
                                            onClick={() => setColorTheme(value)}
                                            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all cursor-pointer ${colorTheme === value
                                                ? "border-primary bg-primary/10"
                                                : "border-border hover:border-primary/40 hover:bg-muted/50"
                                                }`}
                                        >
                                            <div className={`h-6 w-6 rounded-full ${colorClass}`} />
                                            <span className="text-sm font-medium">{label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                    {/* Currency */}
                    <Card className="glass-card border-border/50">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Coins className="h-5 w-5" />
                                Currency
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Choose the currency symbol displayed throughout the app.
                            </p>
                            <div className="grid grid-cols-3 gap-3">
                                {CURRENCIES.map(({ code, symbol, name: currName }) => (
                                    <button
                                        key={code}
                                        onClick={() => setCurrency(code as CurrencyCode)}
                                        className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all cursor-pointer ${currency === code
                                            ? "border-primary bg-primary/10"
                                            : "border-border hover:border-primary/40 hover:bg-muted/50"
                                            }`}
                                    >
                                        <span className="text-lg font-bold">{symbol}</span>
                                        <span className="text-xs text-muted-foreground">{currName}</span>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bank Connections (Plaid) */}
                    <Card className="glass-card border-border/50">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Landmark className="h-5 w-5" />
                                Bank Connections
                            </CardTitle>
                            <CardDescription>
                                Synchronize transactions and balances across your external financial accounts.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!isElectron ? (
                                <div className="bg-destructive/10 border border-destructive/20 text-destructive-foreground/90 p-4 rounded-xl flex gap-3 items-start">
                                    <ShieldAlert className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                                    <div className="space-y-1 text-sm">
                                        <p className="font-semibold text-foreground">Disabled in Web Version</p>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Local-first bank syncing with Plaid is disabled in the web demo. Install the sAIve desktop application on your computer to connect Navy Federal or Discover accounts securely.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Plaid keys setup */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium">Plaid Credentials</p>
                                            <p className="text-xs text-muted-foreground">Configure Plaid API Client ID and Secret</p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowKeyForm(!showKeyForm)}
                                        >
                                            {showKeyForm ? "Close Form" : plaidConfigured ? "Update Keys" : "Setup Keys"}
                                        </Button>
                                    </div>

                                    {showKeyForm && (
                                        <div className="p-4 border border-border/50 rounded-lg bg-background/30 space-y-3 animate-fade-in">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="settings-plaid-client-id" className="text-xs">Client ID</Label>
                                                <Input
                                                    id="settings-plaid-client-id"
                                                    value={plaidClientId}
                                                    onChange={(e) => setPlaidClientId(e.target.value)}
                                                    placeholder="Paste Client ID..."
                                                    className="bg-background/50 h-9 text-sm"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="settings-plaid-secret" className="text-xs">Secret</Label>
                                                <Input
                                                    id="settings-plaid-secret"
                                                    type="password"
                                                    value={plaidSecret}
                                                    onChange={(e) => setPlaidSecret(e.target.value)}
                                                    placeholder="Paste Secret..."
                                                    className="bg-background/50 h-9 text-sm"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-xs">Environment</Label>
                                                <Select value={plaidEnv} onValueChange={setPlaidEnv}>
                                                    <SelectTrigger className="bg-background/50 h-9 text-sm">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="sandbox">Sandbox (Simulated)</SelectItem>
                                                        <SelectItem value="development">Development (Free/Live Accounts)</SelectItem>
                                                        <SelectItem value="production">Production (Real App)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            {plaidError && <p className="text-xs text-destructive">{plaidError}</p>}
                                            <Button
                                                size="sm"
                                                className="w-full"
                                                onClick={handleSavePlaidKeysInSettings}
                                                disabled={isSavingPlaidKeys}
                                            >
                                                {isSavingPlaidKeys ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Save Keys"}
                                            </Button>
                                        </div>
                                    )}

                                    {plaidConfigured && (
                                        <>
                                            <Separator className="border-border/30" />
                                            
                                            {/* Linked Items and sub-accounts */}
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-semibold">Connected Accounts</h4>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={handleSyncPlaidSettings}
                                                            disabled={isSyncing}
                                                            className="h-8 text-xs"
                                                        >
                                                            <RefreshCw className={`h-3 w-3 mr-1 ${isSyncing ? "animate-spin" : ""}`} />
                                                            Sync Balances
                                                        </Button>
                                                        <Button
                                                            onClick={() => open()}
                                                            disabled={!ready || isLinking}
                                                            size="sm"
                                                            className="h-8 text-xs"
                                                        >
                                                            <Plus className="h-3 w-3 mr-1" />
                                                            Link Bank
                                                        </Button>
                                                    </div>
                                                </div>

                                                {plaidAccounts.length === 0 ? (
                                                    <p className="text-xs text-muted-foreground italic py-2 text-center">
                                                        No bank accounts connected yet. Link Navy Federal or Discover to sync transactions.
                                                    </p>
                                                ) : (
                                                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                                        {plaidAccounts.reduce((acc: any[], current: any) => {
                                                            const item = acc.find(x => x.item_id === current.item_id);
                                                            if (item) {
                                                                item.accounts.push(current);
                                                            } else {
                                                                acc.push({
                                                                    item_id: current.item_id,
                                                                    institution_name: current.institution_name,
                                                                    accounts: [current]
                                                                });
                                                            }
                                                            return acc;
                                                        }, []).map((inst: any) => (
                                                            <div key={inst.item_id} className="p-3 border border-border/30 rounded-lg bg-background/10 space-y-2">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{inst.institution_name}</span>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                                        onClick={() => handleRemoveBankItem(inst.item_id)}
                                                                    >
                                                                        <Trash2 className="h-3.5 w-3.5" />
                                                                    </Button>
                                                                </div>
                                                                <div className="space-y-1.5 pl-1.5">
                                                                    {inst.accounts.map((acct: any) => (
                                                                        <div key={acct.account_id} className="flex justify-between items-center text-xs">
                                                                            <span className="text-muted-foreground">
                                                                                {acct.name} {acct.mask && <span className="font-mono text-[10px]">({acct.mask})</span>}
                                                                            </span>
                                                                            <span className="font-semibold text-foreground">
                                                                                {formatCurrency(acct.balance_current)}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Custom Categories Manager */}
                    <Card className="glass-card border-border/50">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Palette className="h-5 w-5" />
                                Category Management
                            </CardTitle>
                            <CardDescription>
                                Create and delete custom transaction categories across the application.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2 py-2">
                                {categories.map((cat: any) => (
                                    <div
                                        key={cat.name}
                                        className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/50 bg-background/50 text-xs"
                                    >
                                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color === 'muted' ? '#9ca3af' : cat.color === 'income' ? '#10b981' : cat.color === 'cyan' ? '#06b6d4' : cat.color === 'orange' ? '#f97316' : cat.color === 'blue' ? '#3b82f6' : cat.color === 'purple' ? '#a855f7' : cat.color === 'yellow' ? '#eab308' : cat.color }} />
                                        <span className="font-medium">{cat.name}</span>
                                        {!["Housing", "Food", "Transportation", "Subscriptions", "Bills", "Income", "Other"].includes(cat.name) && (
                                            <button
                                                onClick={() => handleDeleteCategory(cat.name)}
                                                className="ml-1 text-muted-foreground hover:text-destructive transition-colors text-sm font-bold"
                                            >
                                                &times;
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <Separator className="border-border/30" />

                            <div className="space-y-3 pt-2">
                                <h4 className="text-sm font-semibold">Add Custom Category</h4>
                                <div className="flex gap-2">
                                    <Input
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        placeholder="Category name (e.g. Travel, Gym)..."
                                        className="bg-background/50 h-9 text-sm flex-1"
                                    />
                                    <Select value={newCategoryColor} onValueChange={setNewCategoryColor}>
                                        <SelectTrigger className="w-32 bg-background/50 h-9 text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="blue">Blue</SelectItem>
                                            <SelectItem value="green">Green</SelectItem>
                                            <SelectItem value="red">Red</SelectItem>
                                            <SelectItem value="orange">Orange</SelectItem>
                                            <SelectItem value="yellow">Yellow</SelectItem>
                                            <SelectItem value="purple">Purple</SelectItem>
                                            <SelectItem value="pink">Pink</SelectItem>
                                            <SelectItem value="cyan">Cyan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        onClick={handleAddCategory}
                                        size="sm"
                                        className="h-9 px-3"
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Features */}
                    <Card className="glass-card border-border/50">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Bot className="h-5 w-5" />
                                AI Features
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Enable AI Features</p>
                                    <p className="text-xs text-muted-foreground">
                                        Allow AI-powered insights, suggestions, and analysis
                                    </p>
                                </div>
                                <button
                                    onClick={() => setAiEnabled(!aiEnabled)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${aiEnabled ? "bg-primary" : "bg-muted-foreground/30"
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${aiEnabled ? "translate-x-6" : "translate-x-1"
                                            }`}
                                    />
                                </button>
                            </div>

                            {aiEnabled && (
                                <>
                                    <Separator />
                                    <div>
                                        <p className="text-sm font-medium mb-1">AI Model</p>
                                        <p className="text-xs text-muted-foreground mb-3">
                                            Choose the AI model to power your features. Changing requires a restart.
                                        </p>
                                        <div className="grid grid-cols-2 gap-3">
                                            {AI_MODELS.map((m) => (
                                                <button
                                                    key={m.id}
                                                    onClick={() => {
                                                        if (m.id !== aiModel) {
                                                            setAiModel(m.id as AiModelId);
                                                            toast.info(`Switched to ${m.label}. Restart to load the new model.`);
                                                        }
                                                    }}
                                                    className={`flex flex-col items-start gap-1 p-4 rounded-lg border-2 transition-all cursor-pointer text-left ${aiModel === m.id
                                                        ? "border-primary bg-primary/10"
                                                        : "border-border hover:border-primary/40 hover:bg-muted/50"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold">{m.label}</span>
                                                        {m.recommended && (
                                                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                                                                Recommended
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">{m.description}</span>
                                                    <span className="text-[10px] text-muted-foreground/70 mt-1">Download: {m.size}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            <p className="text-xs text-muted-foreground italic">
                                {aiEnabled
                                    ? "AI features are enabled. Smart insights will appear across the app."
                                    : "AI features are disabled. No AI-powered analysis will be performed."}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Profile */}
                    <Card className="glass-card border-border/50">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Profile
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    Display Name
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder={isLoading ? "Loading..." : "Enter your name"}
                                        className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                    <Button
                                        size="sm"
                                        onClick={() => updateName.mutate(name)}
                                        disabled={updateName.isPending}
                                    >
                                        <Save className="h-4 w-4 mr-1" />
                                        Save
                                    </Button>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Net Worth</p>
                                    <p className="text-xs text-muted-foreground">Automatically calculated from your transactions</p>
                                </div>
                                <span className="text-lg font-bold text-primary">
                                    {isLoading ? "..." : formatCurrency(userData?.net_worth ?? 0)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Management */}
                    <Card className="glass-card border-border/50">
                        <CardHeader>
                            <CardTitle className="text-lg">Data Management</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">Export Data</p>
                                    <p className="text-xs text-muted-foreground">Download all your transactions and assets as JSON</p>
                                </div>
                                <Button variant="outline" size="sm" onClick={handleExport}>
                                    <Download className="h-4 w-4 mr-1" />
                                    Export
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* About */}
                    <Card className="glass-card border-border/50">
                        <CardHeader>
                            <CardTitle className="text-lg">About</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Version</span>
                                <span className="text-primary">{__APP_VERSION__}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">App</span>
                                <span className="text-sm font-medium">
                                    S<span className="text-primary">AI</span>VE
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </main>
        </>
    );
};

export default Settings;
