"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import { getBadges } from "@/lib/badges";

interface LoanCardProps {
    product: Product;
    isBestMatch?: boolean;
    onAskAboutProduct?: (product: Product) => void;
}

export function LoanCard({ product, isBestMatch, onAskAboutProduct }: LoanCardProps) {
    const badges = getBadges(product);

    return (
        <Card className="flex flex-col justify-between h-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">
                            {product.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {product.bank} • {String(product.type).toUpperCase()}
                        </p>
                    </div>
                    {isBestMatch && (
                        <Badge className="text-xs">Best Match</Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">
                <p>
                    <span className="font-medium">APR:</span> {product.rate_apr}% •{" "}
                    <span className="font-medium">Tenure:</span>{" "}
                    {product.tenure_min_months}–{product.tenure_max_months} months
                </p>
                <p>
                    <span className="font-medium">Min Income:</span> ₹{product.min_income} •{" "}
                    <span className="font-medium">Min Credit Score:</span> {product.min_credit_score}
                </p>
                {product.summary && (
                    <p className="text-muted-foreground line-clamp-2">
                        {product.summary}
                    </p>
                )}
                <div className="flex flex-wrap gap-1 pt-2">
                    {badges.map((badge) => (
                        <Badge key={badge} variant="outline" className="text-xs">
                            {badge}
                        </Badge>
                    ))}
                </div>
            </CardContent>

            <CardFooter className="flex justify-end">
                <Button
                    size="sm"
                    onClick={() => onAskAboutProduct?.(product)}
                >
                    Ask About Product
                </Button>
            </CardFooter>
        </Card>
    );
}
