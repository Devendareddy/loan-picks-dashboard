# Loan Picks Dashboard

Frontend assignment for **ClickPe** – a responsive dashboard that helps users quickly compare loan products and ask questions about each loan using an AI assistant.

The app is built with **Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + Supabase + Gemini/AI**.

---

## 🚀 Features

### 1. Loan Picks Dashboard
- Fetches loan products from **Supabase** (`products` table).
- Shows each product as a card with:
  - Loan name & bank
  - APR, tenure range
  - Minimum income
  - Minimum credit score
  - Tags like **Low APR**, **Prepayment Allowed**, **Fast Disbursal**.
- Designed to be **responsive** (desktop & smaller screens).

### 2. Loan Details + Chat Assistant
- Clicking **“Ask About Product”** opens a side sheet for that loan.
- At the top it shows:
  - Loan name, bank, APR, tenure
  - Key tags as badges.
- A **chat interface** lets the user ask questions like:
  - “What is the minimum income for this loan?”
  - “What is the minimum credit score required?”
  - “What does APR mean for this loan?”
- Backend:
  - The API route `/api/ai/ask` fetches that loan from Supabase.
  - Builds a **grounded prompt** using only that loan’s JSON.
  - Sends it to the AI model and returns a concise answer.
  - If the AI quota/model fails (429 / 404 etc.), the route returns a **friendly fallback message** instead of breaking the UI.

### 3. Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript  
- **UI:** Tailwind CSS, shadcn/ui, Lucide icons  
- **State & routing:** React Server Components + client components where needed  
- **Database:** Supabase (PostgreSQL)  
- **AI:** Google Gemini / OpenAI-compatible client (via `/api/ai/ask`)  
- **Build tooling:** Turbopack, npm  

---

## 🗄️ Data Model

Supabase table: **`products`**

Columns used in the UI:

- `id` (uuid, primary key)
- `name` (text)
- `bank` (text)
- `type` (text – e.g. home, education, vehicle, personal, credit_line)
- `rate_apr` (numeric)
- `min_income` (numeric)
- `min_credit_score` (int)
- `tenure_min_months` (int)
- `tenure_max_months` (int)
- `processing_fee_pct` (numeric)
- `prepayment_allowed` (boolean)
- `disbursal_speed` (text)
- `docs_level` (text)
- `summary` (text)
- `faq` (jsonb)

The dashboard queries this table (top 5 products ordered by APR) and maps the fields to the UI.

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# if you are using an OpenAI-compatible key
OPENAI_API_KEY=your_openai_like_key

# for Gemini (Google AI Studio)
GEMINI_API_KEY=your_gemini_api_key

🧩 Project Structure

app/
  page.tsx              // Fetch top products and render dashboard
  api/
    ai/
      ask/
        route.ts        // AI chat API route

components/
  ui/                   // shadcn/ui components
  dashboard-client.tsx  // Client component for cards layout
  loan-card.tsx         // Single loan card
  product-chat-sheet.tsx// Chat side-sheet for a product

lib/
  supabase.ts           // Supabase admin client
  types.ts              // Shared TypeScript types
  utils.ts              // Helper functions

screenshots/
  home-loan.png
  student-education-loan.png
  quickride-vehicle-loan.png

🧪 How the AI Assistant Works

1.The UI sends productId, message, and previous history to /api/ai/ask.

2.The API:

     Fetches that product from Supabase.

     Builds a system prompt that includes the product JSON.

     Adds conversation history and the latest user question.

     Calls the AI model (Gemini / OpenAI-style chat API).

3.The assistant is strictly grounded to that loan:

    If the user asks about other banks/products, it responds that it can only answer about this loan.

4.Error handling:

     429 / insufficient_quota / 404 model errors are caught.

     Instead of crashing, the route returns a message like
     “Our AI assistant is temporarily unavailable right now. You can still use the APR, minimum income, minimum credit score and tenure above to decide.”

🖼️ Screenshots

These screenshots are in the screenshots/ folder of the repo.

1. Dashboard – Top Loan Picks

Shows all loan cards with tags and the Ask About Product button.

![Dashboard – Top Loan Picks](screenshots/home-loan.png)

2. Chat – Home Loan

User asks about minimum income and credit score for the education loan.

![Chat – Home Loan](screenshots/Home-loan.png)

3. Chat – QuickRide Vehicle Loan

User asks about APR and credit score for the vehicle loan.

![Chat – QuickRide Vehicle Loan](screenshots/quickride-vehicle-loan.png)

4. Student Education Loan

User asks about minimum credit score reuired for Student Education Loan

![Chat – Student Education Loan](screenshots/Student-Education-loan.png)

🛠️ Running the Project Locally
# 1. Clone the repo
git clone https://github.com/Devendareddy/loan-picks-dashboard.git

# 2. Go into the folder
cd loan-picks-dashboard

# 3. Install dependencies
npm install

# 4. Run dev server
npm run dev

Then open http://localhost:3000
 in your browser.

✅ Assignment Coverage

Loan cards UI with all required fields & tags ✔️

Supabase integration for storing & fetching loan data ✔️

Next.js App Router + TypeScript ✔️

Responsive design ✔️

“Ask About Product” flow with chat interface ✔️

AI assistant grounded to specific loan ✔️

Graceful fallback when AI quota is exhausted / model not available ✔️