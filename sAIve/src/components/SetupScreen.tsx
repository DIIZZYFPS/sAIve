import { useState, useEffect } from "react";
import { useSettings, AI_MODELS, type AiModelId } from "@/context/SettingsContext";
import { useAi } from "@/context/AiContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Check, Info, Loader2, ArrowRight, ShieldCheck, Wallet, Landmark, TrendingUp, Lock, Sparkles } from "lucide-react";
import { Loader } from "./Loader";
import api from "@/lib/api";
import { usePlaidLink } from "react-plaid-link";

export function SetupScreen() {
    const {
        aiEnabled, setAiEnabled,
        aiModel, setAiModel,
        setHasCompletedSetup,
        currencySymbol,
        setBaseMonthlyIncome
    } = useSettings();

    const { loadModel, isModelLoaded, status, progress } = useAi();

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Step 2 Form State
    const [checking, setChecking] = useState("");
    const [savings, setSavings] = useState("");
    const [income, setIncome] = useState("");

    // Step 3 state
    const [isSettingUpAi, setIsSettingUpAi] = useState(false);

    // Plaid step states
    const [plaidConfigured, setPlaidConfigured] = useState(false);
    const [plaidClientId, setPlaidClientId] = useState("");
    const [plaidSecret, setPlaidSecret] = useState("");
    const [plaidEnv, setPlaidEnv] = useState("sandbox");
    const [linkToken, setLinkToken] = useState<string | null>(null);
    const [plaidError, setPlaidError] = useState("");
    const [isSavingPlaidKeys, setIsSavingPlaidKeys] = useState(false);
    const [plaidLinkedSuccess, setPlaidLinkedSuccess] = useState(false);
    const [linkedInstName, setLinkedInstName] = useState("");
    const [isLinking, setIsLinking] = useState(false);

    // Dynamic configuration fetch when stepping into Plaid Setup
    useEffect(() => {
        if (step === 25) {
            checkPlaidConfig();
        }
    }, [step]);

    const checkPlaidConfig = async () => {
        try {
            const res = await api.get("/plaid/config");
            if (res.data.is_configured) {
                setPlaidConfigured(true);
                const tokenRes = await api.post("/plaid/create_link_token");
                setLinkToken(tokenRes.data.link_token);
            }
        } catch (e) {
            console.error("Failed to fetch Plaid config:", e);
        }
    };

    const handleSavePlaidConfig = async () => {
        if (!plaidClientId || !plaidSecret) {
            setPlaidError("Client ID and Secret are required.");
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
            setPlaidConfigured(true);
            const tokenRes = await api.post("/plaid/create_link_token");
            setLinkToken(tokenRes.data.link_token);
        } catch (e: any) {
            setPlaidError(e.response?.data?.detail || "Failed to save configuration.");
        } finally {
            setIsSavingPlaidKeys(false);
        }
    };

    const handlePreFillSandbox = () => {
        setPlaidClientId("sandbox_client_id");
        setPlaidSecret("sandbox_secret");
        setPlaidEnv("sandbox");
        setPlaidError("");
    };

    const { open, ready } = usePlaidLink({
        token: linkToken || "",
        onSuccess: async (public_token) => {
            setIsLinking(true);
            setPlaidError("");
            try {
                const res = await api.post("/plaid/exchange_public_token", { public_token });
                setLinkedInstName(res.data.institution_name);
                setPlaidLinkedSuccess(true);
            } catch (err: any) {
                setPlaidError(err.response?.data?.detail || "Token exchange failed.");
            } finally {
                setIsLinking(false);
            }
        },
        onExit: (err) => {
             if (err) setPlaidError(err.error_message || err.display_message || "Link exited with error.");
         }
    });

    const handleNextStep = () => {
        setStep(prev => prev + 1);
    };

    const handleSaveBaseline = async () => {
        setIsSubmitting(true);
        try {
            const checkVal = parseFloat(checking) || 0;
            const saveVal = parseFloat(savings) || 0;
            const incVal = parseFloat(income) || 0;

            // Save the baseline to contexts/backend
            setBaseMonthlyIncome(incVal);

            await api.post("/users/1/onboard", {
                checking: checkVal,
                savings: saveVal,
                income: incVal
            });
            setIsSubmitting(false);
            
            if ((window as any).electronAPI) {
                setStep(25);
            } else {
                setStep(3);
            }
        } catch (e) {
            console.error("Failed to onboard:", e);
            setIsSubmitting(false);
        }
    };

    const handleStartAiLoad = async () => {
        if (!aiEnabled) {
            setStep(4);
            return;
        }

        setIsSettingUpAi(true);
        try {
            await loadModel();
        } catch (e) {
            console.error(e);
            setIsSettingUpAi(false);
        }
    };

    // Auto-advance step 3 when AI finishes loading
    useEffect(() => {
        if (isSettingUpAi && isModelLoaded) {
            const timer = setTimeout(() => {
                setStep(4);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [isSettingUpAi, isModelLoaded]);

    // Handle AI error
    useEffect(() => {
        if (isSettingUpAi && status === "error") {
            setIsSettingUpAi(false);
        }
    }, [isSettingUpAi, status]);

    const handleFinish = () => {
        setHasCompletedSetup(true);
    };

    const currentModelInfo = AI_MODELS.find(m => m.id === aiModel);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">

            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15 pointer-events-none blur-sm scale-150">
                <Loader size={800} processing={false} />
            </div>

            <Card className="w-full max-w-md border-border/40 shadow-2xl bg-card/60 backdrop-blur-md relative z-10 transition-all duration-500">

                {/* ---------- STEP 1: WELCOME ---------- */}
                {step === 1 && (
                    <div className="animate-in fade-in zoom-in-95 duration-500">
                        <CardHeader className="text-center pt-8 pb-4">
                            <div className="mx-auto mb-6">
                                <Loader size={80} processing={false} />
                            </div>
                            <CardTitle className="text-3xl font-bold tracking-tight">Welcome to sAIve</CardTitle>
                            <CardDescription className="text-base mt-2">
                                The first intelligent, fully-local financial operating system.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pb-8">
                            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-4 items-start">
                                <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                                <div className="space-y-1 text-sm">
                                    <p className="font-semibold text-foreground">Your Money. Your Data. Your Device.</p>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Unlike cloud-based apps that sell your transaction history, sAIve stores everything directly on your computer. Total privacy, zero compromises.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full text-base h-11" onClick={handleNextStep}>
                                Begin Setup <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </CardFooter>
                    </div>
                )}

                {/* ---------- STEP 2: BASELINE ---------- */}
                {step === 2 && (
                    <div className="animate-in slide-in-from-right-8 fade-in duration-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl">Establish Your Baseline</CardTitle>
                            <CardDescription>
                                To track your growth accurately, sAIve needs to know where you are starting from today.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="checking" className="flex items-center gap-2">
                                    <Landmark className="w-4 h-4 text-primary" /> Current Checking Balance
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                                        {currencySymbol}
                                    </div>
                                    <Input
                                        id="checking"
                                        type="number"
                                        placeholder="0.00"
                                        className="pl-7 bg-background/50"
                                        value={checking}
                                        onChange={(e) => setChecking(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="savings" className="flex items-center gap-2">
                                    <Wallet className="w-4 h-4 text-emerald-500" /> Current Savings Balance
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                                        {currencySymbol}
                                    </div>
                                    <Input
                                        id="savings"
                                        type="number"
                                        placeholder="0.00"
                                        className="pl-7 bg-background/50"
                                        value={savings}
                                        onChange={(e) => setSavings(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 mt-4 pt-4 border-t border-border/50">
                                <Label htmlFor="income" className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-blue-500" /> Expected Monthly Income
                                </Label>
                                <p className="text-xs text-muted-foreground mb-2">Used by the AI to forecast your savings rate.</p>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                                        {currencySymbol}
                                    </div>
                                    <Input
                                        id="income"
                                        type="number"
                                        placeholder="0.00"
                                        className="pl-7 bg-background/50"
                                        value={income}
                                        onChange={(e) => setIncome(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-2">
                            <Button className="w-full text-base h-11" onClick={handleSaveBaseline} disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : "Save Balances"}
                            </Button>
                        </CardFooter>
                    </div>
                )}

                {/* ---------- STEP 2.5: PLAID BANK LINK ---------- */}
                {step === 25 && (
                    <div className="animate-in slide-in-from-right-8 fade-in duration-500">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <Landmark className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-xl">Bank Connections (Optional)</CardTitle>
                            </div>
                            <CardDescription>
                                Securely link your Navy Federal, Discover, or other bank accounts to automatically sync transactions.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {!plaidConfigured ? (
                                <div className="space-y-3">
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 p-3 rounded-lg text-xs flex gap-2">
                                        <Info className="h-4 w-4 shrink-0 mt-0.5" />
                                        <span>Plaid developer keys are needed for bank integrations. You can sign up free on Plaid's website or use sandbox mode keys.</span>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="plaid-client-id" className="text-xs">Plaid Client ID</Label>
                                        <Input
                                            id="plaid-client-id"
                                            placeholder="Paste Client ID..."
                                            value={plaidClientId}
                                            onChange={(e) => setPlaidClientId(e.target.value)}
                                            className="bg-background/50 h-9 text-sm"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="plaid-secret" className="text-xs">Plaid Secret</Label>
                                        <Input
                                            id="plaid-secret"
                                            type="password"
                                            placeholder="Paste Secret..."
                                            value={plaidSecret}
                                            onChange={(e) => setPlaidSecret(e.target.value)}
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

                                    {plaidError && <p className="text-xs text-destructive font-medium">{plaidError}</p>}

                                    <div className="flex gap-2 pt-2">
                                        <Button variant="outline" size="sm" className="flex-1 h-9" onClick={handlePreFillSandbox}>
                                            Pre-fill Sandbox
                                        </Button>
                                        <Button size="sm" className="flex-1 h-9" onClick={handleSavePlaidConfig} disabled={isSavingPlaidKeys}>
                                            {isSavingPlaidKeys ? <Loader2 className="animate-spin w-4 h-4" /> : "Save Keys"}
                                        </Button>
                                    </div>
                                </div>
                            ) : plaidLinkedSuccess ? (
                                <div className="flex flex-col items-center py-6 text-center space-y-4">
                                    <div className="bg-emerald-500/10 p-3 rounded-full text-emerald-500">
                                        <Check className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground text-lg">Bank Linked Successfully!</h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Connected to <span className="font-semibold text-primary">{linkedInstName}</span>. Imported past 60 days of transaction data.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center py-8 text-center space-y-4">
                                    <div className="bg-primary/10 p-3 rounded-full text-primary animate-pulse">
                                        <Sparkles className="h-8 w-8" />
                                    </div>
                                    <div className="max-w-[280px]">
                                        <h4 className="font-semibold text-foreground">Keys Saved Successfully</h4>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Your local environment is now Plaid-enabled. Press the button below to sign in to Discover or Navy Federal.
                                        </p>
                                    </div>
                                    {plaidError && <p className="text-xs text-destructive font-medium">{plaidError}</p>}
                                    <Button
                                        onClick={() => open()}
                                        disabled={!ready || isLinking}
                                        className="h-11 w-full text-sm font-semibold"
                                    >
                                        {isLinking ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                                        Connect Bank Account
                                    </Button>
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="flex justify-between border-t border-border/30 pt-4">
                            <Button variant="ghost" size="sm" onClick={() => setStep(3)}>
                                Skip / Do Later
                            </Button>
                            {plaidLinkedSuccess && (
                                <Button size="sm" onClick={() => setStep(3)}>
                                    Next: Setup AI <ArrowRight className="ml-1 w-4 h-4" />
                                </Button>
                            )}
                        </CardFooter>
                    </div>
                )}

                {/* ---------- STEP 3: INTELLIGENCE ENGINE ---------- */}
                {step === 3 && (
                    <div className="animate-in slide-in-from-right-8 fade-in duration-500">
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <Bot className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-xl">Intelligence Engine</CardTitle>
                            </div>
                            <CardDescription>
                                sAIve uses a local AI agent to analyze your spending and answer financial questions privately.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6 pt-2">
                            <div className="flex items-center justify-between space-x-4 border p-4 rounded-lg bg-background/50">
                                <div className="flex flex-col space-y-1">
                                    <Label htmlFor="ai-toggle" className="text-base font-medium">Enable AI Assistant</Label>
                                    <span className="text-xs text-muted-foreground">
                                        Required for conversational features.
                                    </span>
                                </div>
                                <input
                                    id="ai-toggle"
                                    type="checkbox"
                                    checked={aiEnabled}
                                    onChange={(e) => setAiEnabled(e.target.checked)}
                                    className="h-5 w-5 accent-primary cursor-pointer"
                                />
                            </div>

                            {aiEnabled && (
                                <div className="space-y-4 animate-in fade-in duration-300">
                                    <div className="space-y-2">
                                        <Label>Select AI Model</Label>
                                        <Select
                                            value={aiModel}
                                            onValueChange={(val) => setAiModel(val as AiModelId)}
                                            disabled={isSettingUpAi}
                                        >
                                            <SelectTrigger className="bg-background/50">
                                                <SelectValue placeholder="Select a model" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {AI_MODELS.map((model) => (
                                                    <SelectItem key={model.id} value={model.id}>
                                                        <span className="font-medium">{model.label}</span>
                                                        <span className="ml-2 text-xs text-muted-foreground">({model.size})</span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {currentModelInfo && (
                                            <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded border border-border/50 flex gap-2 mt-2">
                                                <Info className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                                                {currentModelInfo.description}
                                            </div>
                                        )}
                                    </div>

                                    {/* Download Progress Area */}
                                    {isSettingUpAi && (
                                        <div className="space-y-4 pt-4 border-t border-border/30">
                                            <div className="bg-secondary/10 border border-border/40 p-3 flex flex-col items-center justify-center rounded-lg animate-pulse">
                                                <p className="text-xs text-muted-foreground font-medium mb-1 tracking-widest uppercase">Try asking later:</p>
                                                <p className="text-sm italic text-foreground text-center">"How much did I spend on food this month?"</p>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground flex items-center gap-2">
                                                        {isModelLoaded ? (
                                                            <><Check className="h-4 w-4 text-green-500" /> Ready</>
                                                        ) : status === "error" ? (
                                                            <span className="text-red-500">Error loading model</span>
                                                        ) : (
                                                            <><Loader2 className="h-4 w-4 animate-spin text-primary" /> {status === "loading" ? "Downloading Engine..." : "Initializing..."}</>
                                                        )}
                                                    </span>
                                                    {progress && (
                                                        <span className="text-xs font-mono font-medium">{Math.round(progress.progress)}%</span>
                                                    )}
                                                </div>
                                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary transition-all duration-300 ease-out"
                                                        style={{ width: isModelLoaded ? "100%" : `${progress?.progress ?? 5}%` }}
                                                    />
                                                </div>
                                                {progress?.file && (
                                                    <p className="text-[10px] text-muted-foreground truncate text-right">
                                                        {progress.file}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full text-base h-11"
                                onClick={handleStartAiLoad}
                                disabled={isSettingUpAi && !isModelLoaded && status !== "error"}
                            >
                                {isSettingUpAi ? (
                                    isModelLoaded ? "Finalizing..." : status === "error" ? "Retry Download" : "Preparing Engine..."
                                ) : (
                                    aiEnabled ? "Download Engine" : "Skip AI Setup"
                                )}
                            </Button>
                        </CardFooter>
                    </div>
                )}

                {/* ---------- STEP 4: HANDOFF ---------- */}
                {step === 4 && (
                    <div className="animate-in zoom-in-95 fade-in duration-700">
                        <CardHeader className="text-center pt-8 pb-4">
                            <div className="mx-auto mb-6 bg-background rounded-full p-2 mt-4 shadow-xl">
                                {/* The solid coin logo we generated earlier */}
                                <Loader processing={false} />
                            </div>
                            <CardTitle className="text-3xl font-bold tracking-tight text-primary">System Initialized</CardTitle>
                            <CardDescription className="text-base mt-2">
                                Your baseline is set and the AI is ready. You have complete control.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-6 pb-8">
                            <Button className="w-full text-base h-12 shadow-lg hover:shadow-primary/20 transition-all font-semibold" onClick={handleFinish}>
                                Enter Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </CardFooter>
                    </div>
                )}
            </Card>
        </div>
    );
}
