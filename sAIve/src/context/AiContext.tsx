
import { createContext, useContext, useRef, useState, useCallback, useEffect, type ReactNode } from "react";
import { toast } from "sonner";
import { useSettings, AI_MODELS } from "@/context/SettingsContext";

const VALID_CATEGORIES = ["Food", "Transportation", "Subscriptions", "Bills", "Housing", "Other", "Income"] as const;
type Category = typeof VALID_CATEGORIES[number];

export interface Message {
    role: "user" | "assistant" | "system";
    content: string;
}

interface AiContextType {
    isModelLoaded: boolean;
    status: "idle" | "loading" | "generating" | "error";
    progress: { file: string; progress: number } | null;
    loadModel: () => Promise<void>;
    generate: (input: string | Message[], maxTokens?: number) => Promise<string>;
    suggestCategory: (title: string) => Promise<Category | null>;
    interrupt: () => void;
}

const AiContext = createContext<AiContextType | undefined>(undefined);

export function AiProvider({ children }: { children: ReactNode }) {
    const workerRef = useRef<Worker | null>(null);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [status, setStatus] = useState<"idle" | "loading" | "generating" | "error">("idle");
    const [progress, setProgress] = useState<{ file: string; progress: number } | null>(null);
    const { aiModel } = useSettings();

    // Promise resolvers for generate calls
    // We treat generation as a singleton operation for simplicity
    const generateResolveRef = useRef<((value: string) => void) | null>(null);
    const generateRejectRef = useRef<((reason?: any) => void) | null>(null);

    useEffect(() => {
        // Initialize worker
        if (!workerRef.current) {
            workerRef.current = new Worker(new URL('../workers/ai.worker.ts', import.meta.url), { type: 'module' });

            workerRef.current.onmessage = (e) => {
                const { status: workerStatus, type, data, output, error } = e.data;

                // Handle status updates
                if (workerStatus) {
                    // Don't override main status if we are in specific states unless worker says so
                    if (workerStatus === "loading") setStatus("loading");
                    if (workerStatus === "generating") setStatus("generating");
                    if (workerStatus === "ready") {
                        setIsModelLoaded(true);
                        setStatus("idle");
                        setProgress(null);
                        // Only toast if we were waiting for it? 
                        // Actually, loadModel is called explicitly.
                    }
                    if (workerStatus === "error") {
                        setStatus("error");
                        toast.error(error || "AI Error");
                        if (generateRejectRef.current) {
                            generateRejectRef.current(new Error(error));
                            generateRejectRef.current = null;
                        }
                    }
                }

                if (type === "progress") {
                    setProgress(data);
                }

                if (type === "complete") {
                    if (generateResolveRef.current) {
                        generateResolveRef.current(output);
                        generateResolveRef.current = null;
                        generateRejectRef.current = null;
                    }
                    setStatus("idle");
                }
            };
        }

        return () => {
            workerRef.current?.terminate();
            workerRef.current = null;
        };
    }, []);

    const loadModel = useCallback(async () => {
        const modelConfig = AI_MODELS.find((m) => m.id === aiModel) ?? AI_MODELS[0];

        // Reset state
        setIsModelLoaded(false);
        setStatus("loading");

        workerRef.current?.postMessage({
            type: "load",
            model: modelConfig.repo,
            dtype: modelConfig.dtype
        });
    }, [aiModel]);

    const generate = useCallback(async (input: string | Message[], maxTokens = 200): Promise<string> => {
        if (!workerRef.current) throw new Error("Worker not initialized");
        // We don't check isModelLoaded here strictly to allow auto-loading, 
        // but typically UI should prevent it.

        return new Promise((resolve, reject) => {
            // Cancel any pending generation?
            if (generateRejectRef.current) {
                generateRejectRef.current(new Error("New generation started"));
            }

            generateResolveRef.current = resolve;
            generateRejectRef.current = reject;

            let messages: Message[] = [];
            if (typeof input === "string") {
                messages = [
                    { role: "system", content: "You are sAIve, a helpful personal finance assistant." },
                    { role: "user", content: input }
                ];
            } else {
                messages = input;
            }

            workerRef.current?.postMessage({
                type: "generate",
                messages,
                config: {
                    max_new_tokens: maxTokens,
                    temperature: 0.7,
                    do_sample: true,
                    top_k: 50,
                }
            });
        });
    }, []);

    const suggestCategory = useCallback(async (title: string): Promise<Category | null> => {
        if (!isModelLoaded) return null;

        const prompt: Message[] = [
            { role: "system", content: "You are a transaction categorizer. Reply with exactly one word: the category. Valid categories: Food, Transportation, Subscriptions, Bills, Housing, Other, Income." },
            { role: "user", content: `Categorize this transaction: "${title}"` }
        ];

        try {
            // Use a short generation
            const result = await generate(prompt, 10);

            const cleaned = result.trim().replace(/[^a-zA-Z\s]/g, "");
            const match = VALID_CATEGORIES.find(
                (c) => cleaned.toLowerCase().includes(c.toLowerCase()),
            );
            return match ?? null;
        } catch (e) {
            console.error(e);
            return null;
        }
    }, [isModelLoaded, generate]);

    const interrupt = useCallback(() => {
        workerRef.current?.postMessage({ type: "interrupt" });
        if (generateRejectRef.current) {
            generateRejectRef.current(new Error("Interrupted"));
            generateRejectRef.current = null;
        }
        setStatus("idle");
    }, []);

    return (
        <AiContext.Provider
            value={{
                isModelLoaded,
                status,
                progress,
                loadModel,
                generate,
                suggestCategory,
                interrupt,
            }}
        >
            {children}
        </AiContext.Provider>
    );
}

export function useAi() {
    const context = useContext(AiContext);
    if (!context) {
        throw new Error("useAi must be used within an AiProvider");
    }
    return context;
}
