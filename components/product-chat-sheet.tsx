"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types";
import { getBadges } from "@/lib/badges";

type ChatMessage = {
    role: "user" | "assistant";
    content: string;
};

interface ProductChatSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: Product | null;
}

export function ProductChatSheet({ open, onOpenChange, product }: ProductChatSheetProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!product) return null;

    const badges = getBadges(product);

    async function handleSend() {
        if (!input.trim()) return;

        const newMessage: ChatMessage = { role: "user", content: input.trim() };
        const nextHistory = [...messages, newMessage];

        setMessages(nextHistory);
        setInput("");
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/ai/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: product.id,
                    message: newMessage.content,
                    history: nextHistory,
                }),
            });

            const json = await res.json();
            if (!res.ok) {
                throw new Error(json.error ?? "Something went wrong");
            }

            const assistantMessage: ChatMessage = {
                role: "assistant",
                content: json.answer,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="flex flex-col w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>{product.name}</SheetTitle>
                    <p className="text-sm text-muted-foreground">
                        {product.bank} • APR {product.rate_apr}% • Tenure{" "}
                        {product.tenure_min_months}–{product.tenure_max_months} months
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                        {badges.map((badge) => (
                            <Badge key={badge} variant="outline" className="text-xs">
                                {badge}
                            </Badge>
                        ))}
                    </div>
                </SheetHeader>

                <div className="flex-1 mt-4 border rounded-md p-2 flex flex-col">
                    <ScrollArea className="flex-1 pr-2">
                        <div className="space-y-3">
                            {messages.map((m, i) => (
                                <div
                                    key={i}
                                    className={`text-sm p-2 rounded-md ${m.role === "user"
                                            ? "bg-muted ml-auto max-w-[80%]"
                                            : "bg-secondary mr-auto max-w-[80%]"
                                        }`}
                                >
                                    {m.content}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>

                    {error && (
                        <Alert className="mt-2 text-sm">
                            {error}
                        </Alert>
                    )}

                    <div className="mt-2 flex gap-2">
                        <Input
                            placeholder="Ask a question about this loan..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !loading) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        />
                        <Button disabled={loading} onClick={handleSend}>
                            {loading ? "..." : "Send"}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
