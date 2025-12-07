import { supabaseAdmin } from "../lib/supabase";
import type { Product } from "../lib/types";
import { DashboardClient } from "../components/dashboard-client";

async function getTopProducts(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("rate_apr", { ascending: true })
    .limit(5);

  if (error || !data) {
    console.error(error);
    return [];
  }

  return data as Product[];
}

export default async function Home() {
  const products = await getTopProducts();

  return (
    <main className="p-4">
      <DashboardClient products={products} />
    </main>
  );
}
