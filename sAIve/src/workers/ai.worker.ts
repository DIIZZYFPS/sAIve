
import { pipeline, env, TextStreamer } from "@huggingface/transformers";

// Skip local checks for now
env.allowLocalModels = false;
env.useBrowserCache = true;

// Define message types
type AIWorkerMessage =
    | { type: "load"; model: string; dtype: string; device?: string }
    | { type: "generate"; messages: any[]; config: any }
    | { type: "interrupt" };

// Global state
let generator: any = null;
let currentModel: string | null = null;

self.addEventListener("message", async (e: MessageEvent<AIWorkerMessage>) => {
    const { type } = e.data;

    switch (type) {
        case "load":
            await loadModel(e.data as any);
            break;
        case "generate":
            await generateText(e.data as any);
            break;
        case "interrupt":
            // Transformers.js doesn't support easy interruption yet
            break;
    }
});

async function loadModel({ model, dtype, device = "webgpu" }: { model: string; dtype: string; device?: string }) {
    if (currentModel === model && generator) {
        self.postMessage({ status: "ready", model });
        return;
    }

    try {
        self.postMessage({ status: "loading", model });

        // Check for WebGPU support in worker
        if (device === "webgpu" && !(navigator as any).gpu) {
            throw new Error("WebGPU not supported in worker");
        }

        generator = await pipeline("text-generation", model, {
            device: device as any,
            dtype: dtype as any,
            progress_callback: (prog: any) => {
                self.postMessage({
                    type: "progress",
                    data: {
                        file: prog.file,
                        progress: prog.progress ?? 0
                    }
                });
            },
        });

        currentModel = model;
        self.postMessage({ status: "ready", model });
    } catch (err: any) {
        self.postMessage({ status: "error", error: err.message });
    }
}

async function generateText({ messages, config }: { messages: any[]; config: any }) {
    if (!generator) {
        self.postMessage({ status: "error", error: "Model not loaded" });
        return;
    }

    self.postMessage({ status: "generating" });

    try {
        const streamer = new TextStreamer(generator.tokenizer, {
            skip_prompt: true,
            skip_special_tokens: true,
            callback_function: (text: string) => {
                self.postMessage({ type: "token", token: text });
            }
        });

        const output = await generator(messages, {
            ...config,
            streamer,
        });

        // Extract the final response text
        let finalResponse = "";
        if (Array.isArray(output) && output.length > 0) {
            const lastItem = output[0];
            if (lastItem.generated_text) {
                if (Array.isArray(lastItem.generated_text)) {
                    // It's a messages array (Llama style)
                    finalResponse = lastItem.generated_text.at(-1)?.content ?? "";
                } else if (typeof lastItem.generated_text === "string") {
                    // It's a raw string (Gemma style if prompted with string)
                    finalResponse = lastItem.generated_text;
                }
            }
        }

        self.postMessage({ type: "complete", output: finalResponse });
    } catch (err: any) {
        self.postMessage({ status: "error", error: err.message });
    }
}
