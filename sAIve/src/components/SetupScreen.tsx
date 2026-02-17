
import { useState, useEffect } from "react";
import { useSettings, AI_MODELS, type AiModelId } from "@/context/SettingsContext";
import { useAi } from "@/context/AiContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Check, Info, Loader2 } from "lucide-react";

export function SetupScreen() {
    const {
        aiEnabled, setAiEnabled,
        aiModel, setAiModel,
        setHasCompletedSetup
    } = useSettings();

    const { loadModel, isModelLoaded, status, progress } = useAi();

    // Local state to track if we initiated the setup connection
    const [isSettingUp, setIsSettingUp] = useState(false);

    const handleStart = async () => {
        if (!aiEnabled) {
            setHasCompletedSetup(true);
            return;
        }

        setIsSettingUp(true);
        try {
            await loadModel();
            // We wait for status to become 'idle' (or check isModelLoaded via effect)
        } catch (e) {
            console.error(e);
            setIsSettingUp(false);
        }
    };

    // Effect: successful load transitions to app
    useEffect(() => {
        if (isSettingUp && isModelLoaded) {
            // Small delay for UX to show "Ready!"
            const timer = setTimeout(() => {
                setHasCompletedSetup(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isSettingUp, isModelLoaded, setHasCompletedSetup]);

    // Effect: handle error status to allow retry
    useEffect(() => {
        if (isSettingUp && status === "error") {
            setIsSettingUp(false);
        }
    }, [isSettingUp, status]);

    const currentModelInfo = AI_MODELS.find(m => m.id === aiModel);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 animate-in fade-in duration-700">
            <Card className="w-full max-w-md border-border/40 shadow-xl bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4 w-fit">
                        <Bot className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Welcome to sAIve</CardTitle>
                    <CardDescription>
                        Let's set up your personal finance assistant.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 pt-6">
                    {/* AI Toggle */}
                    <div className="flex items-center justify-between space-x-4 border p-4 rounded-lg bg-secondary/20">
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="ai-toggle" className="text-base font-medium">Enable AI Assistant</Label>
                            <span className="text-xs text-muted-foreground">
                                Runs locally on your device. Private & Secure.
                            </span>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="ai-toggle"
                                type="checkbox"
                                checked={aiEnabled}
                                onChange={(e) => setAiEnabled(e.target.checked)}
                                className="h-5 w-5 accent-primary cursor-pointer"
                            />
                        </div>
                    </div>

                    {aiEnabled && (
                        <div className="space-y-4 animate-in slide-in-from-top-2 fade-in duration-300">
                            <div className="space-y-2">
                                <Label>Select AI Model</Label>
                                <Select
                                    value={aiModel}
                                    onValueChange={(val) => setAiModel(val as AiModelId)}
                                    disabled={isSettingUp}
                                >
                                    <SelectTrigger>
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
                                    <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded border border-border/50 flex gap-2">
                                        <Info className="h-4 w-4 shrink-0 mt-0.5" />
                                        {currentModelInfo.description}
                                    </div>
                                )}
                            </div>

                            {/* Progress / Status Area */}
                            {isSettingUp && (
                                <div className="space-y-2 pt-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            {isModelLoaded ? (
                                                <>
                                                    <Check className="h-4 w-4 text-green-500" /> Ready
                                                </>
                                            ) : status === "error" ? (
                                                <span className="text-red-500">Error loading model</span>
                                            ) : (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    {status === "loading" ? "Downloading Model..." : "Initializing..."}
                                                </>
                                            )}
                                        </span>
                                        {progress && (
                                            <span className="text-xs font-mono">{Math.round(progress.progress)}%</span>
                                        )}
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-300 ease-out"
                                            style={{
                                                width: isModelLoaded ? "100%" : `${progress?.progress ?? 5}%`
                                            }}
                                        />
                                    </div>
                                    {progress?.file && (
                                        <p className="text-[10px] text-muted-foreground truncate">
                                            {progress.file}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>

                <CardFooter>
                    <Button
                        className="w-full"
                        size="lg"
                        onClick={handleStart}
                        disabled={isSettingUp && !isModelLoaded && status !== "error"}
                    >
                        {isSettingUp ? (
                            isModelLoaded ? "Enter App" : status === "error" ? "Retry" : "Setting things up..."
                        ) : (
                            "Start sAIve"
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
