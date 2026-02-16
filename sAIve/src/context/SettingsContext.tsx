import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD";
export type AiModelId = "gemma-270m" | "gemma-1b" | "llama-1b";

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
    recommended?: boolean;
}

export const AI_MODELS: AiModelInfo[] = [
    {
        id: "gemma-1b",
        label: "Gemma 3 1B",
        description: "Best reasoning & logic. Recommended.",
        repo: "onnx-community/gemma-3-1b-it-ONNX",
        size: "~800 MB",
        recommended: true,
    },
    {
        id: "llama-1b",
        label: "Llama 3.2 1B",
        description: "Smart generalist. Huge context (128k).",
        repo: "onnx-community/Llama-3.2-1B-Instruct-ONNX",
        size: "~1.2 GB",
    },
    {
        id: "gemma-270m",
        label: "Gemma 3 270M",
        description: "Instant speed. Basic tasks only.",
        repo: "onnx-community/gemma-3-270m-it-ONNX",
        size: "~300 MB",
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
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = "saive-settings";

interface StoredSettings {
    currency: CurrencyCode;
    aiEnabled: boolean;
    aiModel: AiModelId;
}

function loadSettings(): StoredSettings {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            return {
                currency: parsed.currency ?? "USD",
                aiEnabled: parsed.aiEnabled ?? true,
                aiModel: parsed.aiModel ?? "gemma-1b",
            };
        }
    } catch {
        // ignore
    }
    return { currency: "USD", aiEnabled: true, aiModel: "gemma-1b" };
}

function saveSettings(settings: StoredSettings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrencyState] = useState<CurrencyCode>(() => loadSettings().currency);
    const [aiEnabled, setAiEnabledState] = useState<boolean>(() => loadSettings().aiEnabled);
    const [aiModel, setAiModelState] = useState<AiModelId>(() => loadSettings().aiModel);

    const currencyInfo = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];

    useEffect(() => {
        saveSettings({ currency, aiEnabled, aiModel });
    }, [currency, aiEnabled, aiModel]);

    const setCurrency = (code: CurrencyCode) => setCurrencyState(code);
    const setAiEnabled = (enabled: boolean) => setAiEnabledState(enabled);
    const setAiModel = (model: AiModelId) => setAiModelState(model);

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
