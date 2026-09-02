import { internalMutation, mutation, type MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { faker } from "@faker-js/faker";

async function seedAll(ctx: MutationCtx) {
  // 1. Clear existing records for clean idempotent seeding
    const tablesToClear = [
      "users",
      "profiles",
      "experiences",
      "skills",
      "companies",
      "jobs",
      "matches",
      "posts",
      "comments",
      "likes",
      "follows",
      "savedJobs",
      "recruiters",
      "outreachDrafts",
      "profileDrafts",
      "careerPlans",
      "aiRuns",
    ] as const;

    for (const table of tablesToClear) {
      const records = await ctx.db.query(table).take(200);
      for (const record of records) {
        await ctx.db.delete(record._id);
      }
    }

    faker.seed(42);

    // 2. Create Companies
    const companiesData = [
      {
        name: "Vercel",
        slug: "vercel",
        logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop",
        industry: "Cloud & Developer Tools",
        location: "San Francisco, CA (Remote)",
        size: "500-1000",
        about: "Vercel's Frontend Cloud gives developers collaborative frameworks and infrastructure to build and deploy high-performance websites and AI applications.",
        website: "https://vercel.com",
      },
      {
        name: "Linear",
        slug: "linear",
        logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop",
        industry: "Productivity Software",
        location: "San Francisco, CA (Remote)",
        size: "50-100",
        about: "Linear is a purpose-built tool for modern product development: issue tracking, cycle planning, and product roadmaps with unmatched speed.",
        website: "https://linear.app",
      },
      {
        name: "Supabase",
        slug: "supabase",
        logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop",
        industry: "Database & Backend",
        location: "Singapore / Remote",
        size: "100-250",
        about: "Supabase is an open source Firebase alternative providing Postgres databases, Authentication, Instant APIs, Realtime subscriptions, and Vector storage.",
        website: "https://supabase.com",
      },
      {
        name: "Anthropic",
        slug: "anthropic",
        logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop",
        industry: "Artificial Intelligence",
        location: "San Francisco, CA",
        size: "250-500",
        about: "Anthropic is an AI safety and research company building reliable, interpretable, and steerable AI systems like Claude.",
        website: "https://anthropic.com",
      },
      {
        name: "Perplexity AI",
        slug: "perplexity",
        logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop",
        industry: "AI & Search",
        location: "San Francisco, CA (Remote)",
        size: "100-250",
        about: "Perplexity AI is an conversational search engine delivering instant answers and citations using advanced LLM reasoning.",
        website: "https://perplexity.ai",
      },
      {
        name: "Cursor",
        slug: "cursor",
        logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop",
        industry: "AI Developer Tools",
        location: "San Francisco, CA",
        size: "20-50",
        about: "Cursor is the AI-first Code Editor built to make software engineers hyper-productive through intelligent code generation.",
        website: "https://cursor.com",
      },
      {
        name: "Stripe",
        slug: "stripe",
        logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop",
        industry: "Financial Technology",
        location: "San Francisco & Dublin",
        size: "5000+",
        about: "Stripe is a financial infrastructure platform for businesses, powering online payments and subscription economies worldwide.",
        website: "https://stripe.com",
      },
      {
        name: "Clerk",
        slug: "clerk",
        logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop",
        industry: "Authentication & Identity",
        location: "San Francisco, CA (Remote)",
        size: "50-100",
        about: "Clerk provides drop-in user management, modern authentication, session tokens, and organizations for React & Next.js.",
        website: "https://clerk.com",
      },
      {
        name: "Notion",
        slug: "notion",
        logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop",
        industry: "Productivity & Collaboration",
        location: "San Francisco, CA",
        size: "500-1000",
        about: "Notion is the connected workspace where better, faster work happens, blending notes, docs, project management, and AI.",
        website: "https://notion.so",
      },
      {
        name: "Figma",
        slug: "figma",
        logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop",
        industry: "Design & Collaboration",
        location: "San Francisco, CA",
        size: "1000-2500",
        about: "Figma connects everyone in the design process so teams can deliver better products from wireframe to code.",
        website: "https://figma.com",
      },
    ];

    const companyIdMap = new Map<string, any>();
    for (const comp of companiesData) {
      const id = await ctx.db.insert("companies", comp);
      companyIdMap.set(comp.slug, id);
    }

    // 3. Create Recruiters for Companies
    const recruitersData = [
      {
        companySlug: "vercel",
        name: "Sarah Jenkins",
        title: "Staff Technical Recruiter — AI & Infrastructure",
        email: "sarah.jenkins@vercel.com",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop",
        linkedinUrl: "https://linkedin.com/in/sarah-jenkins-tech",
      },
      {
        companySlug: "linear",
        name: "Marcus Vance",
        title: "Head of Talent & Engineering Hiring",
        email: "marcus@linear.app",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop",
        linkedinUrl: "https://linkedin.com/in/marcus-vance",
      },
      {
        companySlug: "supabase",
        name: "Priya Patel",
        title: "Lead Technical Recruiter",
        email: "priya@supabase.com",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop",
        linkedinUrl: "https://linkedin.com/in/priya-patel-supabase",
      },
      {
        companySlug: "cursor",
        name: "David Kim",
        title: "Founding Recruiter — AI Systems",
        email: "david@cursor.com",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop",
        linkedinUrl: "https://linkedin.com/in/david-kim-cursor",
      },
      {
        companySlug: "anthropic",
        name: "Elena Rostova",
        title: "Senior AI Talent Partner",
        email: "elena@anthropic.com",
        avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&h=128&fit=crop",
        linkedinUrl: "https://linkedin.com/in/elena-rostova-anthropic",
      },
      {
        companySlug: "stripe",
        name: "Jason Brooks",
        title: "Lead Engineering Sourcer",
        email: "jbrooks@stripe.com",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop",
        linkedinUrl: "https://linkedin.com/in/jason-brooks-stripe",
      },
      {
        companySlug: "clerk",
        name: "Chloe Martin",
        title: "People & Talent Lead",
        email: "chloe@clerk.com",
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop",
        linkedinUrl: "https://linkedin.com/in/chloe-martin-clerk",
      },
    ];

    const recruiterIdMap = new Map<string, any>();
    for (const rec of recruitersData) {
      const companyId = companyIdMap.get(rec.companySlug);
      if (companyId) {
        const id = await ctx.db.insert("recruiters", {
          companyId,
          name: rec.name,
          title: rec.title,
          email: rec.email,
          avatarUrl: rec.avatarUrl,
          linkedinUrl: rec.linkedinUrl,
        });
        recruiterIdMap.set(rec.companySlug, id);
      }
    }

    // 4. Hand-crafted Demo Candidate: Alex Carter
    const alexUserId = "demo_alex_carter";
    await ctx.db.insert("users", {
      clerkId: alexUserId,
      name: "Alex Carter",
      email: "alex.carter@example.com",
      imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop",
      role: "free",
      bio: "Frontend developer passionate about modern web apps and transitioning into Next.js & AI engineering.",
    });

    await ctx.db.insert("profiles", {
      userId: alexUserId,
      username: "alex-carter",
      fullName: "Alex Carter",
      headline: "Junior/Mid Frontend Developer @ WebSolutions | HTML, CSS, React | Open to opportunities",
      about: "I build websites and user interfaces with React, JavaScript, and CSS. Looking to expand my skillset and transition to Next.js, AI Application development, and modern fullstack engineering.",
      location: "London, UK",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop",
      coverUrl: "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?w=1200&h=300&fit=crop",
      targetRole: "Next.js AI Engineer",
      completenessScore: 62,
    });

    // Alex's experiences
    await ctx.db.insert("experiences", {
      userId: alexUserId,
      company: "WebSolutions Ltd",
      title: "Frontend Developer",
      location: "London, UK",
      startDate: "Mar 2022",
      current: true,
      description: "Built client dashboard components using React and Redux. Maintained legacy CSS stylesheets and converted jQuery components to React.",
      skills: ["React", "JavaScript", "Redux", "CSS3", "Webpack"],
    });

    await ctx.db.insert("experiences", {
      userId: alexUserId,
      company: "DigitalCraft Agency",
      title: "Junior Web Developer",
      location: "London, UK",
      startDate: "Jan 2020",
      endDate: "Feb 2022",
      current: false,
      description: "Implemented responsive web designs from Figma mockups using HTML, CSS, and basic JavaScript. Maintained WordPress themes.",
      skills: ["HTML5", "CSS3", "JavaScript", "WordPress", "Git"],
    });

    // Alex's initial skills
    const alexSkills = [
      { name: "React", category: "Frontend", endorsements: 14 },
      { name: "JavaScript", category: "Languages", endorsements: 21 },
      { name: "HTML5", category: "Frontend", endorsements: 18 },
      { name: "CSS3", category: "Frontend", endorsements: 15 },
      { name: "Redux", category: "State Management", endorsements: 8 },
      { name: "Git", category: "Tools", endorsements: 12 },
      { name: "Webpack", category: "Build Tools", endorsements: 5 },
      { name: "REST APIs", category: "Backend", endorsements: 9 },
    ];

    for (const sk of alexSkills) {
      await ctx.db.insert("skills", {
        userId: alexUserId,
        name: sk.name,
        category: sk.category,
        endorsements: sk.endorsements,
      });
    }

    // 5. Create ~20 Diverse Tech Jobs
    const jobsData = [
      // 3 High-Match Target Jobs for Next.js AI Engineer
      {
        companySlug: "vercel",
        title: "Next.js & AI Systems Engineer",
        slug: "nextjs-ai-systems-engineer",
        location: "London, UK (Remote)",
        workplaceType: "remote" as const,
        employmentType: "full-time" as const,
        salaryRange: { min: 160000, max: 195000, currency: "USD" },
        experienceLevel: "senior" as const,
        description: "Join the core team building Next.js and Vercel AI SDK integration. You will design developer workflows, stream structured LLM outputs, build agentic systems, and optimize latency across edge networks.",
        requirements: [
          "5+ years building production web applications with React, Next.js, and TypeScript.",
          "Demonstrated experience integrating LLMs with the Vercel AI SDK or direct provider APIs.",
          "Strong understanding of React Server Components, streaming SSR, and edge compute runtime.",
          "Familiarity with vector embeddings, semantic search, and RAG architectures.",
        ],
        requiredSkills: ["Next.js", "TypeScript", "React", "AI SDK", "Tailwind CSS", "Vector Search"],
        preferredSkills: ["Eve", "Convex", "Python", "RAG", "LLM Evals"],
        isActive: true,
        postedAt: "2 days ago",
      },
      {
        companySlug: "linear",
        title: "Fullstack Engineer — Product & AI",
        slug: "fullstack-engineer-product-ai",
        location: "London / Hybrid",
        workplaceType: "hybrid" as const,
        employmentType: "full-time" as const,
        salaryRange: { min: 150000, max: 185000, currency: "USD" },
        experienceLevel: "senior" as const,
        description: "We are crafting the next generation of AI-driven project management. Build blazingly fast sync engines, keyboard-first interfaces, and autonomous issue triage features.",
        requirements: [
          "Deep expertise in TypeScript, React, and realtime client-server sync architectures.",
          "Experience crafting delightful, responsive UI with attention to detail and animations.",
          "Hands-on experience with LLM tool calling, prompt design, and context window optimization.",
        ],
        requiredSkills: ["TypeScript", "React", "Next.js", "Node.js", "AI Workflows", "Tailwind CSS"],
        preferredSkills: ["Convex", "SQLite", "Electron", "Vector DBs"],
        isActive: true,
        postedAt: "3 days ago",
      },
      {
        companySlug: "supabase",
        title: "Senior Frontend AI Engineer",
        slug: "senior-frontend-ai-engineer",
        location: "Remote (Global)",
        workplaceType: "remote" as const,
        employmentType: "full-time" as const,
        salaryRange: { min: 155000, max: 190000, currency: "USD" },
        experienceLevel: "senior" as const,
        description: "Build developer-first AI tools, vector dashboard explorers, and SQL generation assistants. Help millions of developers harness Postgres Vector and embeddings.",
        requirements: [
          "Expert knowledge of React, Next.js App Router, and TypeScript.",
          "Experience with pgvector, vector embeddings, and semantic search interfaces.",
          "Track record of writing clean, accessible, and performant open-source frontend code.",
        ],
        requiredSkills: ["React", "TypeScript", "Next.js", "Postgres", "Vector Embeddings", "AI SDK"],
        preferredSkills: ["SQL", "Supabase", "Tailwind CSS", "Edge Functions"],
        isActive: true,
        postedAt: "1 day ago",
      },

      // 3 Stretch / Advanced Roles
      {
        companySlug: "anthropic",
        title: "Staff Machine Learning Systems Architect",
        slug: "staff-ml-systems-architect",
        location: "San Francisco, CA (Hybrid)",
        workplaceType: "hybrid" as const,
        employmentType: "full-time" as const,
        salaryRange: { min: 250000, max: 320000, currency: "USD" },
        experienceLevel: "lead" as const,
        description: "Architect high-throughput training clusters, distributed inference pipelines, and safety evaluation infrastructure for frontier Claude models.",
        requirements: [
          "8+ years in distributed systems, high-performance computing, and ML infrastructure.",
          "Proficiency with PyTorch, CUDA, Triton, and large-scale GPU orchestration (Slurm/Kube).",
          "Deep understanding of transformer model architectures and low-latency KV-caching.",
        ],
        requiredSkills: ["PyTorch", "CUDA", "Python", "Distributed Systems", "Kubernetes", "C++"],
        preferredSkills: ["Triton", "Slurm", "Model Quantization", "NCCL"],
        isActive: true,
        postedAt: "4 days ago",
      },
      {
        companySlug: "perplexity",
        title: "Lead AI Agent Engineer",
        slug: "lead-ai-agent-engineer",
        location: "San Francisco, CA (Remote)",
        workplaceType: "remote" as const,
        employmentType: "full-time" as const,
        salaryRange: { min: 190000, max: 240000, currency: "USD" },
        experienceLevel: "lead" as const,
        description: "Lead the development of multi-step autonomous research agents. Build search planning algorithms, citation grounding, and automated evaluation suites.",
        requirements: [
          "6+ years software engineering with at least 2 years focused on LLM agent architectures.",
          "Expertise in tool-use frameworks, structured outputs, and synthetic data generation.",
          "Experience with Python, LangGraph, Eve, or custom reinforcement learning from human feedback.",
        ],
        requiredSkills: ["Python", "AI Agents", "Tool Calling", "RAG", "TypeScript", "FastAPI"],
        preferredSkills: ["Eve", "LangChain", "Evaluation Frameworks", "Vector Databases"],
        isActive: true,
        postedAt: "5 days ago",
      },
      {
        companySlug: "cursor",
        title: "Senior AI Integration Specialist",
        slug: "senior-ai-integration-specialist",
        location: "San Francisco, CA (Hybrid)",
        workplaceType: "hybrid" as const,
        employmentType: "full-time" as const,
        salaryRange: { min: 175000, max: 215000, currency: "USD" },
        experienceLevel: "senior" as const,
        description: "Optimize codebase indexing, AST parsing, and context assembly for IDE-level code generation. Benchmark model speed and precision.",
        requirements: [
          "Strong TypeScript and C++/Rust or Python capabilities.",
          "Experience with Tree-sitter, language servers, and AST-based code manipulation.",
          "Knowledge of embedding index structures and sparse-dense retrieval.",
        ],
        requiredSkills: ["TypeScript", "Rust", "AST Parsing", "Vector Indexing", "LLM APIs"],
        preferredSkills: ["VS Code Extension API", "Tree-sitter", "Python"],
        isActive: true,
        postedAt: "2 days ago",
      },

      // 14 Additional Tech Roles
      {
        companySlug: "clerk",
        title: "Senior Fullstack Auth Engineer",
        slug: "senior-fullstack-auth-engineer",
        location: "London / Remote",
        workplaceType: "remote" as const,
        employmentType: "full-time" as const,
        salaryRange: { min: 145000, max: 175000, currency: "USD" },
        experienceLevel: "senior" as const,
        description: "Build robust multi-tenant authentication SDKs, organization billing workflows, and session synchronization libraries across React and Next.js.",
        requirements: [
          "4+ years building secure web applications and OAuth / Passkey integrations.",
          "Expertise with Next.js middleware, cookies, and modern browser security standards.",
        ],
        requiredSkills: ["TypeScript", "Next.js", "React", "OAuth", "JWT", "Node.js"],
        preferredSkills: ["Clerk SDKs", "Passkeys", "Tailwind CSS"],
        isActive: true,
        postedAt: "1 week ago",
      },
      {
        companySlug: "stripe",
        title: "Frontend Platform Engineer",
        slug: "frontend-platform-engineer-stripe",
        location: "Dublin, Ireland (Hybrid)",
        workplaceType: "hybrid" as const,
        employmentType: "full-time" as const,
        salaryRange: { min: 140000, max: 170000, currency: "USD" },
        experienceLevel: "mid" as const,
        description: "Enhance developer toolchains, CI build performance, and design system components for thousands of Stripe engineers.",
        requirements: [
          "3+ years working on large-scale frontend repositories and design systems.",
          "Strong proficiency with TypeScript, React, Vite/Turbopack, and automated testing.",
        ],
        requiredSkills: ["TypeScript", "React", "Design Systems", "CI/CD", "Jest", "Webpack"],
        preferredSkills: ["Turbopack", "Microfrontends", "Ruby"],
        isActive: true,
        postedAt: "4 days ago",
      },
      {
        companySlug: "figma",
        title: "UI Systems & Canvas Developer",
        slug: "ui-systems-canvas-developer",
        location: "London, UK",
        workplaceType: "on-site" as const,
        employmentType: "full-time" as const,
        salaryRange: { min: 155000, max: 190000, currency: "USD" },
        experienceLevel: "senior" as const,
        description: "Work on Figma's web-based rendering engine and design system components. Optimize WebGL shaders, canvas rendering, and reactive DOM controls.",
        requirements: [
          "Experience with WebAssembly, WebGL, TypeScript, and high-performance canvas rendering.",
          "Strong foundation in data structures and geometry algorithms.",
        ],
        requiredSkills: ["TypeScript", "WebGL", "Canvas API", "React", "Wasm", "Performance Optimization"],
        preferredSkills: ["C++", "Rust", "Design Systems"],
        isActive: true,
        postedAt: "6 days ago",
      },
      {
        companySlug: "notion",
        title: "Fullstack Product Developer — Notion AI",
        slug: "fullstack-product-developer-notion-ai",
        location: "San Francisco / Remote",
        workplaceType: "remote" as const,
        employmentType: "full-time" as const,
        salaryRange: { min: 160000, max: 200000, currency: "USD" },
        experienceLevel: "senior" as const,
        description: "Build Notion AI features: document summarization, Q&A over team knowledge bases, automated autofill, and custom AI connectors.",
        requirements: [
          "5+ years building user-facing web applications with React and TypeScript.",
          "Experience integrating embedding search and LLM completion pipelines.",
        ],
        requiredSkills: ["React", "TypeScript", "Node.js", "AI APIs", "Postgres", "Tailwind CSS"],
        preferredSkills: ["GraphQL", "Vector Databases", "Redis"],
        isActive: true,
        postedAt: "3 days ago",
      },
      {
        companySlug: "vercel",
        title: "Junior/Mid Frontend Engineer — v0",
        slug: "junior-mid-frontend-engineer-v0",
        location: "Remote",
        workplaceType: "remote" as const,
        employmentType: "full-time" as const,
        salaryRange: { min: 110000, max: 140000, currency: "USD" },
        experienceLevel: "mid" as const,
        description: "Help build the v0 generative UI platform. Create beautiful preview sandboxes, integrate shadcn/ui components, and streamline prompt editing.",
        requirements: [
          "2+ years experience building modern web apps with React and Tailwind CSS.",
          "Passion for UI design, micro-interactions, and AI-assisted development.",
        ],
        requiredSkills: ["React", "Tailwind CSS", "JavaScript", "TypeScript", "HTML/CSS"],
        preferredSkills: ["Next.js", "Shadcn UI", "Figma"],
        isActive: true,
        postedAt: "1 day ago",
      },
      {
        companySlug: "linear",
        title: "Growth & Lifecycle Engineer",
        slug: "growth-lifecycle-engineer",
        location: "Remote",
        workplaceType: "remote" as const,
        employmentType: "full-time" as const,
        salaryRange: { min: 130000, max: 160000, currency: "USD" },
        experienceLevel: "mid" as const,
        description: "Optimize onboarding funnels, referral loops, team invitation flows, and interactive product walkthroughs.",
        requirements: [
          "3+ years experience in fullstack web development with React and Node.js.",
          "Strong analytical mindset and familiarity with A/B testing frameworks.",
        ],
        requiredSkills: ["React", "TypeScript", "Next.js", "Analytics", "Postgres"],
        preferredSkills: ["Convex", "Tailwind CSS", "Growth Engineering"],
        isActive: true,
        postedAt: "5 days ago",
      },
      {
        companySlug: "supabase",
        title: "Developer Advocate — AI & Vectors",
        slug: "developer-advocate-ai-vectors",
        location: "Remote",
        workplaceType: "remote" as const,
        employmentType: "full-time" as const,
        salaryRange: { min: 135000, max: 165000, currency: "USD" },
        experienceLevel: "mid" as const,
        description: "Create sample apps, technical guides, video walkthroughs, and live workshops demonstrating how to build AI apps with pgvector and Next.js.",
        requirements: [
          "Strong communication skills with hands-on coding ability in TypeScript and Python.",
          "Experience building and shipping AI/LLM apps in public.",
        ],
        requiredSkills: ["Next.js", "TypeScript", "Python", "Technical Writing", "Supabase"],
        preferredSkills: ["Video Production", "Community Building", "AI SDK"],
        isActive: true,
        postedAt: "1 week ago",
      },
      {
        companySlug: "cursor",
        title: "DevOps & Cloud Infrastructure Engineer",
        slug: "devops-cloud-infrastructure-engineer",
        location: "San Francisco / Remote",
        workplaceType: "remote" as const,
        employmentType: "full-time" as const,
        salaryRange: { min: 165000, max: 200000, currency: "USD" },
        experienceLevel: "senior" as const,
        description: "Manage GPU clusters, autoscaling inference microservices, Cloudflare routes, and low-latency WebSocket routing.",
        requirements: [
          "Experience managing multi-region Kubernetes clusters and Terraform infrastructure.",
          "Knowledge of GPU observability and cost optimization.",
        ],
        requiredSkills: ["Kubernetes", "Terraform", "AWS", "Docker", "Go", "CI/CD"],
        preferredSkills: ["Cloudflare Workers", "GPU Scheduling", "Prometheus"],
        isActive: true,
        postedAt: "4 days ago",
      },
      {
        companySlug: "anthropic",
        title: "Frontend Software Engineer — Claude Web",
        slug: "frontend-software-engineer-claude-web",
        location: "San Francisco, CA",
        workplaceType: "hybrid" as const,
        employmentType: "full-time" as const,
        salaryRange: { min: 165000, max: 205000, currency: "USD" },
        experienceLevel: "senior" as const,
        description: "Craft the user experience of Claude.ai. Build artifact previews, interactive canvas rendering, streaming chat interfaces, and workspace collaboration.",
        requirements: [
          "4+ years building high-traffic web applications with React and TypeScript.",
          "Deep knowledge of streaming rendering, accessibility (a11y), and responsive design.",
        ],
        requiredSkills: ["React", "TypeScript", "Streaming UI", "CSS/Tailwind", "State Management"],
        preferredSkills: ["Next.js", "WebSockets", "Artifact Sandboxing"],
        isActive: true,
        postedAt: "2 days ago",
      },
      {
        companySlug: "stripe",
        title: "Backend API Engineer — Billing & Invoicing",
        slug: "backend-api-engineer-stripe",
        location: "London / Remote",
        workplaceType: "hybrid" as const,
        employmentType: "full-time" as const,
        salaryRange: { min: 155000, max: 190000, currency: "USD" },
        experienceLevel: "senior" as const,
        description: "Design fault-tolerant ledger APIs, subscription scheduling engines, and automated tax calculation endpoints handling billions in volume.",
        requirements: [
          "5+ years backend engineering experience with strong concurrency and ACID transaction fundamentals.",
        ],
        requiredSkills: ["Go", "Ruby", "Postgres", "Distributed Transactions", "REST APIs"],
        preferredSkills: ["Fintech", "Microservices", "gRPC"],
        isActive: true,
        postedAt: "1 week ago",
      },
      {
        companySlug: "notion",
        title: "Mobile Engineer (React Native)",
        slug: "mobile-engineer-react-native",
        location: "San Francisco / Remote",
        workplaceType: "remote" as const,
        employmentType: "full-time" as const,
        salaryRange: { min: 150000, max: 180000, currency: "USD" },
        experienceLevel: "mid" as const,
        description: "Deliver smooth mobile document editing and offline-first database synchronization on iOS and Android.",
        requirements: [
          "3+ years developing React Native or native mobile applications.",
          "Experience profiling 60fps animations, SQLite storage, and background sync.",
        ],
        requiredSkills: ["React Native", "TypeScript", "iOS/Android", "Mobile UI", "SQLite"],
        preferredSkills: ["Native Modules", "Kotlin", "Swift"],
        isActive: true,
        postedAt: "6 days ago",
      },
      {
        companySlug: "clerk",
        title: "Developer Experience & SDK Engineer",
        slug: "developer-experience-sdk-engineer",
        location: "Remote",
        workplaceType: "remote" as const,
        employmentType: "full-time" as const,
        salaryRange: { min: 140000, max: 170000, currency: "USD" },
        experienceLevel: "mid" as const,
        description: "Maintain and evolve official Clerk SDKs for React, Next.js, Remix, Astro, and Express. Build interactive playground docs and starter templates.",
        requirements: [
          "3+ years building and publishing open-source JavaScript/TypeScript libraries.",
          "Deep understanding of framework lifecycles and modern bundlers.",
        ],
        requiredSkills: ["TypeScript", "Next.js", "React", "Open Source", "Package Tooling"],
        preferredSkills: ["Astro", "Remix", "Testing"],
        isActive: true,
        postedAt: "3 days ago",
      },
      {
        companySlug: "figma",
        title: "Frontend Collaboration Engineer",
        slug: "frontend-collaboration-engineer",
        location: "London, UK",
        workplaceType: "hybrid" as const,
        employmentType: "full-time" as const,
        salaryRange: { min: 160000, max: 195000, currency: "USD" },
        experienceLevel: "senior" as const,
        description: "Power real-time multiplayer presence, cursor syncing, voice huddles, and collaborative branching in Figma files.",
        requirements: [
          "4+ years building real-time multiplayer web interfaces with WebSockets or WebRTC.",
          "Familiarity with CRDTs, Operational Transformation, and state reconciliation.",
        ],
        requiredSkills: ["TypeScript", "React", "WebSockets", "CRDTs", "Realtime Sync"],
        preferredSkills: ["WebRTC", "Rust", "Performance"],
        isActive: true,
        postedAt: "5 days ago",
      },
      {
        companySlug: "vercel",
        title: "Founding AI Developer Advocate",
        slug: "founding-ai-developer-advocate",
        location: "London / Remote",
        workplaceType: "remote" as const,
        employmentType: "full-time" as const,
        salaryRange: { min: 145000, max: 180000, currency: "USD" },
        experienceLevel: "mid" as const,
        description: "Champion the Next.js AI ecosystem. Build open source templates, write deep-dive guides on Vercel Eve and AI SDK, and speak at global developer events.",
        requirements: [
          "Proven record of shipping creative AI experiments and publishing educational content.",
          "Hands-on proficiency with Next.js, Tailwind CSS, and AI SDK.",
        ],
        requiredSkills: ["Next.js", "TypeScript", "AI SDK", "Developer Relations", "Public Speaking"],
        preferredSkills: ["Eve", "Convex", "Tailwind CSS"],
        isActive: true,
        postedAt: "Just now",
      },
    ];

    let targetJobId: any = null;
    for (const job of jobsData) {
      const companyId = companyIdMap.get(job.companySlug);
      if (companyId) {
        const id = await ctx.db.insert("jobs", {
          companyId,
          title: job.title,
          slug: job.slug,
          location: job.location,
          workplaceType: job.workplaceType,
          employmentType: job.employmentType,
          salaryRange: job.salaryRange,
          experienceLevel: job.experienceLevel,
          description: job.description,
          requirements: job.requirements,
          requiredSkills: job.requiredSkills,
          preferredSkills: job.preferredSkills,
          isActive: job.isActive,
          postedAt: job.postedAt,
        });

        if (job.slug === "nextjs-ai-systems-engineer") {
          targetJobId = id;
        }
      }
    }

    // 6. Seed saved job for Alex Carter
    if (targetJobId) {
      await ctx.db.insert("savedJobs", {
        userId: alexUserId,
        jobId: targetJobId,
      });

      // Weak initial outreach draft for Alex
      const vercelRecruiterId = recruiterIdMap.get("vercel");
      await ctx.db.insert("outreachDrafts", {
        userId: alexUserId,
        jobId: targetJobId,
        recruiterId: vercelRecruiterId,
        subject: "Application for Next.js role",
        body: "Hi Sarah, I saw your Next.js opening and I have worked with React for 3 years. Please take a look at my resume and let me know if we can chat.",
        tone: "formal",
        status: "draft",
      });
    }

    // 7. Seed Feed Posts & Discussions
    const seedPosts = [
      {
        userId: "user_guillermo",
        authorName: "Guillermo Rauch",
        authorHeadline: "CEO @ Vercel",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop",
        content: "The next decade of software is about AI agents running on the edge with durable execution. Next.js 16 + Vercel Eve makes building agentic web apps as natural as writing a React component.",
        likesCount: 142,
        commentsCount: 28,
      },
      {
        userId: "user_sarah",
        authorName: "Sarah Jenkins",
        authorHeadline: "Staff Technical Recruiter @ Vercel",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop",
        content: "🚀 We are hiring a Next.js & AI Systems Engineer in London & Remote! If you love building streaming AI interfaces, vector search, and edge workflows, reach out or check our open roles!",
        likesCount: 89,
        commentsCount: 14,
      },
      {
        userId: "user_marcus",
        authorName: "Marcus Vance",
        authorHeadline: "Head of Talent @ Linear",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop",
        content: "What separates good frontend engineers from great AI engineers in 2026? Mastery of latency, structured output validation, streaming UX, and evaluation loops. Exciting times ahead!",
        likesCount: 215,
        commentsCount: 39,
      },
      {
        userId: alexUserId,
        authorName: "Alex Carter",
        authorHeadline: "Junior/Mid Frontend Developer @ WebSolutions",
        authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop",
        content: "Starting my journey to master Next.js App Router and the AI SDK! Transitioning from pure client-side React to modern AI fullstack engineering. Any tips from fellow builders?",
        likesCount: 34,
        commentsCount: 8,
      },
    ];

    for (const post of seedPosts) {
      const postId = await ctx.db.insert("posts", post);
      // Add a demo comment to Alex's post
      if (post.userId === alexUserId) {
        await ctx.db.insert("comments", {
          postId,
          userId: "user_sarah",
          authorName: "Sarah Jenkins",
          authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop",
          content: "Focus on Server Actions, streaming AI outputs, and understanding vector embeddings! Best of luck Alex!",
        });
      }
    }

    return {
      success: true,
      message: "Database successfully seeded with Alex Carter profile, 10 companies, 7 recruiters, 20 jobs, and feed posts.",
    };
}

export const run = internalMutation({
  args: {},
  handler: async (ctx) => {
    return await seedAll(ctx);
  },
});

export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    return await seedAll(ctx);
  },
});

