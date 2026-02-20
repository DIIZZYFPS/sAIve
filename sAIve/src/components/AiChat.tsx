import { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Bot, User, Loader2, Cpu, Send } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";
import { useAi, type Message } from "@/context/AiContext";
import { MiniLoader } from "./MiniLoader";



interface AiChatProps {
    trigger: React.ReactNode;
}

// Build a financial context string from the user's data
function buildFinancialContext(
    asset: any,
    categories: any[],
    history: any[],
    transactions: any[],
    formatCurrency: (n: number) => string,
): string {
    const lines: string[] = [];
    const now = new Date();
    lines.push(`Today is ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`);

    // Current month snapshot
    if (asset?.asset) {
        const a = asset.asset;
        const u = asset.user;
        lines.push(`\n--- This Month ---`);
        lines.push(`Income: ${formatCurrency(a.TIncome)}`);
        lines.push(`Expenses: ${formatCurrency(a.TExpense)}`);
        lines.push(`Savings: ${formatCurrency(a.TSavings)}`);
        lines.push(`Net Worth: ${formatCurrency(u?.net_worth ?? a.NetWorth)}`);
        const savingsRate = a.TIncome > 0 ? ((a.TSavings / a.TIncome) * 100).toFixed(1) : '0';
        lines.push(`Savings Rate: ${savingsRate}%`);
    }

    // Category breakdown
    if (categories && categories.length > 0) {
        const total = categories.reduce((s: number, c: any) => s + (c?.amount ?? 0), 0);
        lines.push(`\n--- Expense Breakdown ---`);
        categories.forEach((c: any) => {
            if (!c) return;
            const amount = c.amount ?? 0;
            const pct = total > 0 ? ((amount / total) * 100).toFixed(1) : '0';
            lines.push(`${c.category || 'Unknown'}: ${formatCurrency(amount)} (${pct}%)`);
        });
    }

    // Recent transactions
    if (transactions && transactions.length > 0) {
        lines.push(`\n--- Recent Transactions ---`);
        transactions.slice(-10).reverse().forEach((t: any) => {
            if (!t) return;
            const amount = t.amount ?? 0;
            const sign = t.type === 'income' ? '+' : '-';
            lines.push(`${t.date} | ${sign}${formatCurrency(amount)} | ${t.recipient || 'Unknown'} (${t.category || 'Uncategorized'})`);
        });
    }

    // Trend data (last few months)
    if (history && history.length > 1) {
        lines.push(`\n--- Monthly Trend (Last ${Math.min(history.length, 6)} Months) ---`);
        history.slice(-6).forEach((h: any) => {
            lines.push(`${h.month} ${h.year}: Income ${formatCurrency(h.income)}, Expenses ${formatCurrency(h.expense)}, Savings ${formatCurrency(h.savings)}`);
        });
    }

    return lines.join('\n');
}

export default function AiChat({ trigger }: AiChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Initializing local AI... The model will download on first use.' }
    ]);
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const hasSentBriefing = useRef(false);
    const { formatCurrency } = useSettings();

    // ── Shared AI context ──
    const { isModelLoaded, status, progress, generate } = useAi();

    // ── Fetch financial data ──
    const { data: assetData } = useQuery({
        queryKey: ["asset"],
        queryFn: async () => {
            const response = await api.get("/user_asset/1");
            return response.data;
        },
    });

    const { data: categoryData } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const response = await api.get("/stats/categories/1");
            return response.data;
        },
    });

    const { data: historyData } = useQuery({
        queryKey: ["statsHistory"],
        queryFn: async () => {
            const response = await api.get("/stats/history/1");
            return response.data;
        },
    });

    const { data: transactionsData } = useQuery({
        queryKey: ["transactions"],
        queryFn: async () => {
            const response = await api.get("/transactions/");
            return response.data;
        },
    });

    // Build the financial context string, memoised so it only recalculates when data changes
    const financialContext = useMemo(
        () => buildFinancialContext(assetData, categoryData ?? [], historyData ?? [], transactionsData ?? [], formatCurrency),
        [assetData, categoryData, historyData, transactionsData, formatCurrency],
    );

    // Build the system prompt that gets prepended to every user message
    const systemPrompt = useMemo(() => {
        return [
            `You are sAIve, a concise and friendly personal finance assistant embedded in a budgeting app.`,
            `You have access to the user's real financial data shown below. Use it to give specific, actionable insights.`,
            `Keep responses SHORT (2-4 sentences). Use exact numbers from the data. Be encouraging but honest.`,
            `If the user asks about something the data doesn't cover, say so.`,
            `\n=== USER FINANCIAL DATA ===`,
            financialContext,
            `=== END DATA ===`,
        ].join('\n');
    }, [financialContext]);

    // Model is now loaded at app startup via AppShell

    // Auto-generate a briefing once model + data are ready
    useEffect(() => {
        if (isModelLoaded && assetData && !hasSentBriefing.current && status === 'idle') {
            hasSentBriefing.current = true;
            setMessages(prev => [...prev, { role: 'assistant', content: 'Model loaded! Preparing your financial briefing...' }]);
            generateBriefing();
        }
    }, [isModelLoaded, assetData, status]);

    const generateBriefing = async () => {
        const briefingInstruction = 'Give me a quick financial briefing for today. Mention my top expense category and savings rate.';

        // Use messages array to preserve system instruction
        const promptMessages: Message[] = [
            { role: "system", content: systemPrompt },
            { role: "user", content: briefingInstruction }
        ];

        try {
            const text = await generate(promptMessages, 150);
            setMessages(prev => [...prev, { role: 'assistant', content: text || "I'm ready to help with your finances! Ask me anything about your spending, savings, or budget." }]);
        } catch (err: any) {
            console.error("Briefing generation failed:", err);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm ready! Ask me about your spending, savings, or budget." }]);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || status !== 'idle' || !isModelLoaded) return;

        const userQuestion = input;
        const userMessage: Message = { role: 'user', content: userQuestion };

        // Optimistically update UI
        const newHistory = [...messages, userMessage];
        setMessages(newHistory);
        setInput('');

        try {
            // Filter out internal status messages from the history sent to AI
            // And keep only the last 10 messages to manage context window
            const history = messages.filter(m =>
                !m.content.startsWith('Initializing') &&
                !m.content.startsWith('✅ Model loaded') &&
                !m.content.startsWith('Model loaded!')
            ).slice(-30);

            const promptMessages: Message[] = [
                { role: "system", content: systemPrompt },
                ...history,
                userMessage
            ];

            const text = await generate(promptMessages, 200);
            const aiMessage: Message = { role: 'assistant', content: text || "I couldn't generate a response. Try rephrasing your question!" };
            setMessages(prev => [...prev, aiMessage]);
        } catch (err: any) {
            console.error(err);
            toast.error("Generation failed");
        }
    };

    return (
        <Drawer direction="right" open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
                {trigger}
            </DrawerTrigger>
            <DrawerContent className="h-full flex flex-col">
                <DrawerHeader className="border-b pb-3">
                    <DrawerTitle className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-primary" />
                        sAIve Assistant
                    </DrawerTitle>
                    <p className="text-xs text-muted-foreground">gemma-3-270m · WebGPU · Your data stays local</p>
                </DrawerHeader>

                {/* Progress overlay */}
                {(progress || (status === 'loading' && !isModelLoaded)) && (
                    <div className="px-4 py-6 flex flex-col items-center gap-3 border-b">
                        <MiniLoader size={40} />
                        <p className="text-xs font-medium">
                            {progress ? "Downloading Model..." : "Initializing AI Engine..."}
                        </p>
                        {progress && (
                            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-300"
                                    style={{ width: `${progress.progress ?? 0}%` }}
                                />
                            </div>
                        )}
                        {progress?.file && (
                            <p className="text-[10px] text-muted-foreground">{progress.file} ({Math.round(progress.progress ?? 0)}%)</p>
                        )}
                    </div>
                )}

                {/* Messages */}
                <ScrollArea className="flex-1 px-4 py-3">
                    <div className="space-y-3">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'assistant' && (
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <Bot className="h-3 w-3 text-primary" />
                                    </div>
                                )}
                                <div className={`rounded-lg px-3 py-2 max-w-[85%] text-xs ${msg.role === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                    }`}>
                                    {msg.role === 'assistant' ? (
                                        <ReactMarkdown
                                            components={{
                                                p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                                                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                                ul: ({ children }) => <ul className="list-disc pl-3 mb-1 space-y-0.5">{children}</ul>,
                                                ol: ({ children }) => <ol className="list-decimal pl-3 mb-1 space-y-0.5">{children}</ol>,
                                                li: ({ children }) => <li>{children}</li>,
                                                h1: ({ children }) => <p className="font-bold mb-1">{children}</p>,
                                                h2: ({ children }) => <p className="font-bold mb-1">{children}</p>,
                                                h3: ({ children }) => <p className="font-semibold mb-1">{children}</p>,
                                                code: ({ children }) => <code className="bg-background/50 px-1 py-0.5 rounded text-[10px] font-mono">{children}</code>,
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                                        <User className="h-3 w-3 text-primary-foreground" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {status === 'generating' && (
                            <div className="flex gap-2 justify-start">
                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Bot className="h-3 w-3 text-primary" />
                                </div>
                                <div className="bg-muted rounded-lg px-3 py-2">
                                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Input */}
                <div className="border-t p-3 flex gap-2">
                    <Input
                        placeholder="Ask about your finances..."
                        value={input}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSend()}
                        disabled={status !== 'idle' || !isModelLoaded}
                        className="text-xs h-8"
                    />
                    <Button onClick={handleSend} disabled={status !== 'idle' || !isModelLoaded} size="icon" className="h-8 w-8 shrink-0">
                        {status === 'generating' ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                    </Button>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
