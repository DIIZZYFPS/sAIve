import { useState, useRef, useEffect } from 'react';
import { pipeline, env } from '@huggingface/transformers';
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

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface AiChatProps {
    trigger: React.ReactNode;
}

export default function AiChat({ trigger }: AiChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Initializing local AI... The model will download on first use (~300MB).' }
    ]);
    const [input, setInput] = useState('');
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [status, setStatus] = useState<'idle' | 'loading' | 'generating'>('idle');
    const [progress, setProgress] = useState<{ status: string; name: string; file: string; progress: number; loaded: number; total: number } | null>(null);
    const generatorRef = useRef<any>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen && !generatorRef.current && status === 'idle') {
            loadModel();
        }
    }, [isOpen]);

    const loadModel = async () => {
        try {
            setStatus('loading');
            if (!(navigator as any).gpu) {
                throw new Error("WebGPU is not supported in this browser.");
            }

            generatorRef.current = await pipeline('text-generation', 'onnx-community/gemma-3-270m-it-ONNX', {
                device: 'webgpu',
                progress_callback: (prog: any) => {
                    if (prog.status === 'progress') {
                        setProgress(prog);
                    }
                }
            } as any);

            setStatus('idle');
            setProgress(null);
            setIsModelLoaded(true);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Model loaded! How can I help you with your finances?' }]);
            toast.success("AI Model loaded successfully!");
        } catch (err: any) {
            console.error(err);
            setStatus('idle');
            toast.error(`Failed to load model: ${err.message}`);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || !generatorRef.current || status !== 'idle') return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setStatus('generating');

        try {
            const prompt = `<start_of_turn>user\n${input}<end_of_turn>\n<start_of_turn>model\n`;
            const output = await generatorRef.current(prompt, {
                max_new_tokens: 128,
                temperature: 0.7,
                do_sample: true,
                top_k: 50,
            });

            let generatedText = output[0].generated_text;
            if (generatedText.startsWith(prompt)) {
                generatedText = generatedText.slice(prompt.length);
            }
            generatedText = generatedText.replace(/<end_of_turn>/g, "").trim();

            const aiMessage: Message = { role: 'assistant', content: generatedText };
            setMessages(prev => [...prev, aiMessage]);
        } catch (err: any) {
            console.error(err);
            toast.error("Generation failed");
        } finally {
            setStatus('idle');
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
                        Local AI Assistant
                    </DrawerTitle>
                    <p className="text-xs text-muted-foreground">gemma-3-270m · WebGPU · No account required</p>
                </DrawerHeader>

                {/* Progress overlay */}
                {progress && (
                    <div className="px-4 py-6 flex flex-col items-center gap-3 border-b">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <p className="text-xs font-medium">Downloading Model...</p>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${progress.progress ?? 0}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-muted-foreground">{progress.file} ({Math.round(progress.progress ?? 0)}%)</p>
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
                                    {msg.content}
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
                        placeholder="Type a message..."
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
