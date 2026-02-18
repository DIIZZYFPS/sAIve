
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/ThemeProvider";
import { useSettings, CURRENCIES, AI_MODELS, type CurrencyCode, type AiModelId } from "@/context/SettingsContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";
import { Sun, Moon, Monitor, User, Download, Save, Coins, Bot } from "lucide-react";

const Settings = () => {
    const { theme, setTheme } = useTheme();
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

    // Export data
    const handleExport = async () => {
        try {
            const [transactions, assets] = await Promise.all([
                api.get("/transactions/"),
                api.get("/user_assets/1/all"),
            ]);
            const exportData = {
                exportDate: new Date().toISOString(),
                transactions: transactions.data,
                assets: assets.data,
            };
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `saive-export-${new Date().toISOString().split("T")[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("Data exported successfully!");
        } catch {
            toast.error("Export failed");
        }
    };

    const themeOptions = [
        { value: "light" as const, label: "Light", icon: Sun },
        { value: "dark" as const, label: "Dark", icon: Moon },
        { value: "system" as const, label: "System", icon: Monitor },
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
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Choose how sAIve looks to you.
                            </p>
                            <div className="grid grid-cols-3 gap-3">
                                {themeOptions.map(({ value, label, icon: Icon }) => (
                                    <button
                                        key={value}
                                        onClick={() => setTheme(value)}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all cursor-pointer ${theme === value
                                            ? "border-primary bg-primary/10"
                                            : "border-border hover:border-primary/40 hover:bg-muted/50"
                                            }`}
                                    >
                                        <Icon className="h-6 w-6" />
                                        <span className="text-sm font-medium">{label}</span>
                                    </button>
                                ))}
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
                                <span>0.4.5</span>
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
