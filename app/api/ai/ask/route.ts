import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { productId, message } = body as {
            productId?: string;
            message?: string;
        };

        if (!productId || !message) {
            return NextResponse.json(
                { error: "productId and message are required" },
                { status: 400 }
            );
        }

        // 1️⃣ Fetch the product from Supabase
        const { data: product, error } = await supabaseAdmin
            .from("products")
            .select("*")
            .eq("id", productId)
            .single();

        if (error || !product) {
            console.error("Product fetch error:", error);
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        const q = message.toLowerCase();

        // Helper read values with fallback
        const name = product.name ?? "this loan";
        const bank = product.bank ?? "this bank";
        const type = product.type ?? "loan";
        const apr = product.rate_apr;
        const minIncome = product.min_income;
        const minScore = product.min_credit_score;
        const tMin = product.tenure_min_months;
        const tMax = product.tenure_max_months;
        const prepay = product.prepayment_allowed;
        const procFee = product.processing_fee_pct;
        const disbSpeed = product.disbursal_speed;
        const docsLevel = product.docs_level;

        let answer = "";

        // 2️⃣ Very simple “AI” based on keywords
        if (
            q.includes("minimum income") ||
            q.includes("min income") ||
            q.includes("income required") ||
            q.includes("income for this loan")
        ) {
            answer = `The minimum income required for ${name} is ₹${minIncome}.`;
        } else if (
            q.includes("credit score") ||
            q.includes("cibil") ||
            q.includes("score required")
        ) {
            answer = `The minimum credit score required for ${name} is ${minScore}.`;
        } else if (
            q.includes("apr") ||
            q.includes("interest rate") ||
            q.includes("rate")
        ) {
            answer = `${name} from ${bank} has an APR of ${apr}%.`;
        } else if (
            q.includes("tenure") ||
            q.includes("duration") ||
            q.includes("how long") ||
            q.includes("months")
        ) {
            answer = `The tenure range for ${name} is ${tMin}–${tMax} months.`;
        } else if (
            q.includes("prepayment") ||
            q.includes("pre payment") ||
            q.includes("foreclosure") ||
            q.includes("close early")
        ) {
            answer = prepay
                ? `Yes, prepayment is allowed for ${name}.`
                : `No, prepayment is not allowed for ${name}.`;
        } else if (
            q.includes("processing fee") ||
            q.includes("processing fees") ||
            q.includes("fee")
        ) {
            answer =
                procFee && Number(procFee) > 0
                    ? `${name} has a processing fee of ${procFee}% of the loan amount.`
                    : `${name} does not charge a processing fee (0%).`;
        } else if (
            q.includes("disbursal") ||
            q.includes("disbursement") ||
            q.includes("how fast") ||
            q.includes("speed")
        ) {
            answer = `The disbursal speed for ${name} is described as "${disbSpeed}".`;
        } else if (
            q.includes("documents") ||
            q.includes("docs") ||
            q.includes("documentation")
        ) {
            answer = `The documentation level for ${name} is "${docsLevel}".`;
        } else if (q.includes("type") || q.includes("kind of loan")) {
            answer = `${name} is a ${String(type).toUpperCase()} loan offered by ${bank}.`;
        } else if (q.includes("bank") || q.includes("which bank")) {
            answer = `${name} is offered by ${bank}.`;
        } else {
            // 3️⃣ Generic fallback using all key details
            answer =
                `Here are the key details for ${name} from ${bank}:\n\n` +
                `• Loan type: ${type}\n` +
                `• APR: ${apr}%\n` +
                `• Tenure: ${tMin}–${tMax} months\n` +
                `• Minimum income: ₹${minIncome}\n` +
                `• Minimum credit score: ${minScore}\n` +
                `• Prepayment allowed: ${prepay ? "Yes" : "No"}\n` +
                `• Processing fee: ${procFee && Number(procFee) > 0 ? procFee + "%" : "0%"
                }\n` +
                `• Disbursal speed: ${disbSpeed}\n` +
                `• Documentation level: ${docsLevel}\n\n` +
                `Use these details to decide if this loan fits your needs.`;
        }

        return NextResponse.json({ answer }, { status: 200 });
    } catch (err) {
        console.error("Local AI handler error:", err);

        const fallback =
            "Our assistant is temporarily unavailable. " +
            "You can still use the details above to decide: check the APR, minimum income, minimum credit score, tenure, and tags like 'Low APR' or 'Prepayment Allowed'.";

        return NextResponse.json({ answer: fallback }, { status: 200 });
    }
}
