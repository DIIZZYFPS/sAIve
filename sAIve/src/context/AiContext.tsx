import { createContext, useContext, useRef, useState, useCallback, type ReactNode } from "react";
import { pipeline, env } from "@huggingface/transformers";
import { toast } from "sonner";
import { useSettings, AI_MODELS } from "@/context/SettingsContext";

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

const VALID_CATEGORIES = ["Food", "Transportation", "Subscriptions", "Bills", "Housing", "Other", "Income"] as const;
type Category = typeof VALID_CATEGORIES[number];

export interface Message {
    role: "user" | "assistant" | "system";
    content: string;
}

interface AiContextType {
    /** Whether the model has finished loading */
    isModelLoaded: boolean;
    /** Current AI status */
    status: "idle" | "loading" | "generating";
    /** Download progress (only while loading) */
    progress: { file: string; progress: number } | null;
    /** Load the model (idempotent — will no-op if already loaded/loading) */
    loadModel: () => Promise<void>;
    /** Run a generation. Accepts a raw string prompt OR a chat history array. */
    generate: (input: string | Message[], maxTokens?: number) => Promise<string>;
    /** Suggest a category for a transaction title. Returns a valid category or null. */
    suggestCategory: (title: string) => Promise<Category | null>;
}

const AiContext = createContext<AiContextType | undefined>(undefined);

// ── Sanitise raw model output ──
function sanitizeOutput(raw: string, echoText?: string): string {
    let text = raw;

    // Take everything after the last "<start_of_turn>model" marker (Gemma format)
    const modelMarker = "<start_of_turn>model";
    const lastModelIdx = text.lastIndexOf(modelMarker);
    if (lastModelIdx !== -1) text = text.slice(lastModelIdx + modelMarker.length);

    // Take everything after the last "assistant" header (Llama format)
    const assistantMarker = "<|start_header_id|>assistant<|end_header_id|>";
    const lastAssistantIdx = text.lastIndexOf(assistantMarker);
    if (lastAssistantIdx !== -1) text = text.slice(lastAssistantIdx + assistantMarker.length);

    // Strip turn markers (both Gemma and Llama)
    text = text.replace(/<start_of_turn>/g, "");
    text = text.replace(/<end_of_turn>/g, "");
    text = text.replace(/<\|eot_id\|>/g, "");
    text = text.replace(/<\|start_header_id\|>/g, "");
    text = text.replace(/<\|end_header_id\|>/g, "");
    text = text.replace(/^(user|model|assistant|system)\s*/gm, "");

    // Strip leaked data blocks
    text = text.replace(/===\s*USER FINANCIAL DATA\s*===[\s\S]*?===\s*END DATA\s*===/g, "");

    // Strip system instructions
    text = text.replace(/You are sAIve[\s\S]*?(?=\n\n|$)/i, "");
    text = text.replace(/You have access to the user[\s\S]*?(?=\n\n|$)/i, "");
    text = text.replace(/Keep responses SHORT[\s\S]*?(?=\n\n|$)/i, "");
    text = text.replace(/If the user asks about something[\s\S]*?(?=\n\n|$)/i, "");

    // Strip section headers
    text = text.replace(/---\s*(This Month|Expense Breakdown|Recent Transactions|Monthly Trend)[^-]*---/g, "");

    // Strip echoed instruction
    if (echoText) {
        const escaped = echoText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        text = text.replace(new RegExp("^\\s*" + escaped + "\\s*", "i"), "");
    }

    // Strip "User question:" prefix
    text = text.replace(/^User question:\s*.+?\n/i, "");

    text = text.replace(/\n{3,}/g, "\n\n").trim();
    return text;
}

export function AiProvider({ children }: { children: ReactNode }) {
    const generatorRef = useRef<any>(null);
    const loadingRef = useRef(false);
    const loadedModelRef = useRef<string | null>(null);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [status, setStatus] = useState<"idle" | "loading" | "generating">("idle");
    const [progress, setProgress] = useState<{ file: string; progress: number } | null>(null);
    const { aiModel } = useSettings();

    const loadModel = useCallback(async () => {
        const modelConfig = AI_MODELS.find((m) => m.id === aiModel) ?? AI_MODELS[0];

        // Already loaded this exact model, or already loading
        if (loadedModelRef.current === modelConfig.repo || loadingRef.current) return;

        // If switching models, clear old one
        if (generatorRef.current) {
            generatorRef.current = null;
            setIsModelLoaded(false);
            loadedModelRef.current = null;
        }

        loadingRef.current = true;

        try {
            setStatus("loading");
            if (!(navigator as any).gpu) {
                throw new Error("WebGPU is not supported in this browser.");
            }

            const adapter = await (navigator as any).gpu.requestAdapter();
            console.log("Active WebGPU Adapter:", adapter?.info);


            generatorRef.current = await pipeline(
                "text-generation",
                modelConfig.repo,
                {
                    device: "webgpu",
                    dtype: modelConfig.dtype,
                    progress_callback: (prog: any) => {
                        if (prog.status === "progress") {
                            setProgress({ file: prog.file, progress: prog.progress ?? 0 });
                        }
                    },
                } as any,
            );

            loadedModelRef.current = modelConfig.repo;
            setStatus("idle");
            setProgress(null);
            setIsModelLoaded(true);
            toast.success(`AI Model loaded: ${modelConfig.label}`);
        } catch (err: any) {
            console.error(err);
            setStatus("idle");
            toast.error(`Failed to load model: ${err.message}`);
        } finally {
            loadingRef.current = false;
        }
    }, [aiModel]);

    const isLiteModel = () => loadedModelRef.current?.includes("gemma");

    const generate = useCallback(async (input: string | Message[], maxTokens = 200): Promise<string> => {
        if (!generatorRef.current) throw new Error("Model not loaded");
        setStatus("generating");

        try {
            // Helper to format history for Gemma (raw string)
            const buildGemmaPrompt = (input: string | Message[]) => {
                if (typeof input === "string") {
                    return input.includes("<start_of_turn>")
                        ? input
                        : `<start_of_turn>user\n${input}<end_of_turn>\n<start_of_turn>model\n`;
                }
                // Convert Message[] to Gemma format
                return input.map(m =>
                    `<start_of_turn>${m.role === "system" ? "user" : m.role}\n${m.content}<end_of_turn>`
                ).join("\n") + "\n<start_of_turn>model\n";
            };

            // Helper to format input for Llama (Message[])
            const buildLlamaMessages = (input: string | Message[]): Message[] => {
                if (Array.isArray(input)) return input;
                // If raw string, wrap as user message
                return [
                    { role: "system", content: "You are sAIve, a helpful personal finance assistant." },
                    { role: "user", content: input }
                ];
            };

            if (isLiteModel()) {
                // Gemma: always raw string
                const prompt = buildGemmaPrompt(input);
                const output = await generatorRef.current(prompt, {
                    max_new_tokens: maxTokens,
                    temperature: 0.7,
                    do_sample: true,
                    top_k: 50,
                });
                return sanitizeOutput(output[0].generated_text);
            } else {
                // Llama: always messages array
                const messages = buildLlamaMessages(input);
                const output = await generatorRef.current(messages, {
                    max_new_tokens: maxTokens,
                    temperature: 0.7,
                    do_sample: true,
                    top_k: 50,
                });
                // If input was a string, we wrapped it, so return just content.
                // If it was history, Llama returns the full conversation or jsut the new part?
                // Transformers.js pipeline usually returns the full conversation object or just the generated text object.
                // output[0].generated_text is usually the messages array with the new one appended.
                const lastMsg = output[0].generated_text.at(-1);
                return lastMsg?.content ?? "";
            }
        } finally {
            setStatus("idle");
        }
    }, []);

    const suggestCategory = useCallback(async (title: string): Promise<Category | null> => {
        if (!generatorRef.current || !title.trim()) return null;

        try {
            setStatus("generating");
            let raw: string;

            if (isLiteModel()) {
                // Gemma: few-shot raw string prompt
                const prompt = [
                    `<start_of_turn>user`,
                    `Classify each transaction into one category: Food, Transportation, Subscriptions, Bills, Housing, Other, Income.`,
                    ``,
                    `Netflix → Subscriptions`,
                    `Uber → Transportation`,
                    `Rent → Housing`,
                    `Grocery Store → Food`,
                    `Electric Bill → Bills`,
                    `Salary → Income`,
                    `Amazon → Other`,
                    `Spotify → Subscriptions`,
                    `Gas Station → Transportation`,
                    `Water Bill → Bills`,
                    `McDonalds → Food`,
                    `Mortgage → Housing`,
                    `Freelance Payment → Income`,
                    `${title} →<end_of_turn>`,
                    `<start_of_turn>model\n`,
                ].join("\n");

                const output = await generatorRef.current(prompt, {
                    max_new_tokens: 5,
                    temperature: 0.1,
                    do_sample: true,
                    top_k: 5,
                });
                raw = sanitizeOutput(output[0].generated_text, title);
            } else {
                // Llama: instruction-based messages format
                const messages = [
                    {
                        role: "system",
                        content: "You are a transaction categorizer. Given a transaction title, reply with exactly one word: the category. Valid categories: Food, Transportation, Subscriptions, Bills, Housing, Other, Income. Reply with ONLY the category name, nothing else.",
                    },
                    { role: "user", content: title },
                ];

                const output = await generatorRef.current(messages, {
                    max_new_tokens: 5,
                    temperature: 0.1,
                    do_sample: false,
                });
                raw = output[0].generated_text.at(-1).content;
            }

            const cleaned = raw.trim().replace(/[^a-zA-Z\s]/g, "");
            const match = VALID_CATEGORIES.find(
                (c) => cleaned.toLowerCase().includes(c.toLowerCase()),
            );
            return match ?? null;
        } catch (err) {
            console.error("Category suggestion failed:", err);
            return null;
        } finally {
            setStatus("idle");
        }
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
