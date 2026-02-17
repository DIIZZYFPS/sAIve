import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD";
export type AiModelId = "gemma-270m" | "gemma-1b" | "llama-1b" | "lfm2-1b";

interface CurrencyInfo {
    code: CurrencyCode;
    symbol: string;
    name: string;
}

export interface AiModelInfo {
    id: AiModelId;
    label: string;
    description: string;
    repo: string;
    size: string;
    dtype: string;
    recommended?: boolean;
}

export const AI_MODELS: AiModelInfo[] = [
    {
        id: "llama-1b",
        label: "Llama 3.2 1B",
        description: "Smart generalist. Huge context (128k).",
        repo: "onnx-community/Llama-3.2-1B-Instruct-ONNX",
        size: "~1.2 GB",
        dtype: "q4",
    },
    {
        id: "lfm2-1b",
        label: "LFM2 1.2B",
        description: "Best reasoning & creativity in 1B class. By Liquid AI. Recommended.",
        repo: "onnx-community/LFM2-1.2B-ONNX",
        size: "~800 MB",
        dtype: "q4",
        recommended: true,
    },
    {
        id: "gemma-1b",
        label: "Gemma 3 1B",
        description: "Google's model. Requires powerful GPU (fp16).",
        repo: "onnx-community/gemma-3-1b-it-ONNX-GQA",
        size: "~2 GB",
        dtype: "fp16",
    },
    {
        id: "gemma-270m",
        label: "Gemma 3 270M",
        description: "Instant speed. Basic tasks only. For low-RAM devices.",
        repo: "onnx-community/gemma-3-270m-it-ONNX",
        size: "~300 MB",
        dtype: "q4",
    },
];

export const CURRENCIES: CurrencyInfo[] = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
    { code: "AUD", symbol: "A$", name: "Australian Dollar" },
];

interface SettingsContextType {
    currency: CurrencyCode;
    setCurrency: (currency: CurrencyCode) => void;
    currencySymbol: string;
    formatCurrency: (amount: number) => string;
    aiEnabled: boolean;
    setAiEnabled: (enabled: boolean) => void;
    aiModel: AiModelId;
    setAiModel: (model: AiModelId) => void;
    hasCompletedSetup: boolean;
    setHasCompletedSetup: (completed: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = "saive-settings";

interface StoredSettings {
    currency: CurrencyCode;
    aiEnabled: boolean;
    aiModel: AiModelId;
    hasCompletedSetup: boolean;
}

function loadSettings(): StoredSettings {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            return {
                currency: parsed.currency ?? "USD",
                aiEnabled: parsed.aiEnabled ?? true,
                aiModel: parsed.aiModel ?? "llama-1b",
                hasCompletedSetup: parsed.hasCompletedSetup ?? false,
            };
        }
    } catch {
        // ignore
    }
    return { currency: "USD", aiEnabled: true, aiModel: "llama-1b", hasCompletedSetup: false };
}

function saveSettings(settings: StoredSettings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function SettingsProvider({ children }: { children: ReactNode }) {
    const initialSettings = loadSettings();
    const [currency, setStateCurrency] = useState<CurrencyCode>(() => initialSettings.currency);
    const [aiEnabled, setStateAiEnabled] = useState<boolean>(() => initialSettings.aiEnabled);
    const [aiModel, setStateAiModel] = useState<AiModelId>(() => initialSettings.aiModel);
    const [hasCompletedSetup, setStateHasCompletedSetup] = useState<boolean>(() => initialSettings.hasCompletedSetup);

    const currencyInfo = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];

    useEffect(() => {
        saveSettings({ currency, aiEnabled, aiModel, hasCompletedSetup });
    }, [currency, aiEnabled, aiModel, hasCompletedSetup]);

    const setCurrency = (code: CurrencyCode) => setStateCurrency(code);
    const setAiEnabled = (enabled: boolean) => setStateAiEnabled(enabled);
    const setAiModel = (model: AiModelId) => setStateAiModel(model);
    const setHasCompletedSetup = (completed: boolean) => setStateHasCompletedSetup(completed);

    const formatCurrency = (amount: number): string => {
        return `${currencyInfo.symbol}${amount.toLocaleString()}`;
    };

    return (
        <SettingsContext.Provider
            value={{
                currency,
                setCurrency,
                currencySymbol: currencyInfo.symbol,
                formatCurrency,
                aiEnabled,
                setAiEnabled,
                aiModel,
                setAiModel,
                hasCompletedSetup,
                setHasCompletedSetup,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}


export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}
