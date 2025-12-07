"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { LoanCard } from "./loan-card";
import { ProductChatSheet } from "./product-chat-sheet";

interface DashboardClientProps {
    products: Product[];
}

export function DashboardClient({ products }: DashboardClientProps) {
    const [chatOpen, setChatOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    function handleAskAboutProduct(product: Product) {
        setSelectedProduct(product);
        setChatOpen(true);
    }

    if (!products.length) {
        return <p className="p-4">No products found.</p>;
    }

    return (
        <div className="space-y-4">
            <header>
                <h1 className="text-2xl font-semibold">Your Top Loan Picks</h1>
                <p className="text-sm text-muted-foreground">
                    Based on APR and basic eligibility, here are some good options.
                </p>
            </header>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product, index) => (
                    <LoanCard
                        key={product.id}
                        product={product}
                        isBestMatch={index === 0}
                        onAskAboutProduct={handleAskAboutProduct}
                    />
                ))}
            </div>

            <ProductChatSheet
                open={chatOpen}
                onOpenChange={setChatOpen}
                product={selectedProduct}
            />
        </div>
    );
}
