🚀 Antigravity AI (Content Studio SaaS)

Antigravity AI is a multi-tenant Social Media Management SaaS designed for small business owners. It bridges the gap between generic AI text generation and highly personalized, actionable business strategy.

Instead of just generating text, Antigravity acts as a stateful, interactive Social Media Strategist that remembers your brand's unique context, negotiates strategies, and schedules content directly to a visual calendar.

✨ Key Features

🔒 Secure Multi-Tenant Authentication: Full user flow (Sign-up, Login, OAuth) powered by Supabase Auth with strict Row Level Security (RLS) protecting user data.

🧠 Business Context Engine: A persistent PostgreSQL database layer that stores brand profiles (Industry, Target Audience, Tone of Voice) to ensure AI output is perfectly tailored to each specific business.

💬 Interactive AI Strategy Chat: A dynamic, multi-turn chat interface powered by the Google Gemini API. Users can brainstorm, negotiate pricing strategies, and refine content pillars before generating posts.

📅 Content Calendar System: Allows users to take AI-generated content and save it directly to a database, organized by scheduled dates and platforms.

🛠️ Tech Stack

Frontend:

Next.js 14+ (App Router)

React & TypeScript

Tailwind CSS (Styling & Dark Mode UI)

Lucide React (Icons)

Backend & Database:

Next.js API Routes (Serverless backend)

Supabase (PostgreSQL Database)

Supabase Auth

Google Generative AI SDK (Gemini Flash)

🗺️ Product Roadmap (V2)

The current production build acts as the foundational SaaS layer. The upcoming Phase 2 architecture focuses on advanced data retrieval:

[In Progress] RAG (Retrieval-Augmented Generation): Implementing a Knowledge Base feature where business owners can upload internal documents (Pricing PDFs, training guides, menus).

Vector Search Integration: Utilizing Supabase pgvector to store text chunk embeddings, allowing the Gemini model to dynamically query and cite the business's actual internal data when generating content.

Automated Social Publishing: Integration with Meta/X APIs to auto-publish scheduled calendar rows.

