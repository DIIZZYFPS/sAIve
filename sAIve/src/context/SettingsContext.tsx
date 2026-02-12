import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD";

interface CurrencyInfo {
    code: CurrencyCode;
    symbol: string;
    name: string;
}

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
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = "saive-settings";

interface StoredSettings {
    currency: CurrencyCode;
    aiEnabled: boolean;
}

function loadSettings(): StoredSettings {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch {
        // ignore
    }
    return { currency: "USD", aiEnabled: true };
}

function saveSettings(settings: StoredSettings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrencyState] = useState<CurrencyCode>(() => loadSettings().currency);
    const [aiEnabled, setAiEnabledState] = useState<boolean>(() => loadSettings().aiEnabled);

    const currencyInfo = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];

    useEffect(() => {
        saveSettings({ currency, aiEnabled });
    }, [currency, aiEnabled]);

    const setCurrency = (code: CurrencyCode) => setCurrencyState(code);
    const setAiEnabled = (enabled: boolean) => setAiEnabledState(enabled);

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
