import type { Product } from "./types";

export function getBadges(product: Product): string[] {
    const badges: string[] = [];

    if (product.rate_apr <= 12) {
        badges.push("Low APR");
    } else if (product.rate_apr <= 15) {
        badges.push("Competitive Rate");
    } else {
        badges.push("Flexible Credit");
    }

    if (product.prepayment_allowed) {
        badges.push("Prepayment Allowed");
    }

    if (product.disbursal_speed === "fast") {
        badges.push("Fast Disbursal");
    }

    if (product.docs_level === "low_docs") {
        badges.push("Low Documentation");
    }

    badges.push(`Income ≥ ₹${product.min_income}`);
    badges.push(`Credit Score ≥ ${product.min_credit_score}`);

    // keep 3–4 badges
    return badges.slice(0, 4);
}
