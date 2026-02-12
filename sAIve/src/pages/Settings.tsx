import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/ThemeProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";
import { Sun, Moon, Monitor, User, Download, Save } from "lucide-react";

const Settings = () => {
    const { theme, setTheme } = useTheme();
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
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-auto">
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
                                        {isLoading ? "..." : `$${userData?.net_worth?.toLocaleString() ?? 0}`}
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
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Version</span>
                                    <span className="text-sm font-mono">0.0.2</span>
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
            </div>
        </div>
    );
};

export default Settings;
