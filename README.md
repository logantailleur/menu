# Recipe Menu

A Next.js application for managing recipes with detailed ingredient macros and step-by-step instructions.

## Quick Start

1. **Install dependencies:**

    ```bash
    npm install
    ```

2. **Set up environment variables:**
   Create `.env.local` in the root directory:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    DATABASE_URL=postgresql://user:password@host:port/database?schema=public
    ```

    See [STARTER_GUIDE.md](./STARTER_GUIDE.md) for detailed setup instructions.

3. **Set up the database:**

    ```bash
    npm run db:generate
    npm run db:push
    ```

4. **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

-   **Ingredients Management**: Create and manage ingredients with detailed macro information
-   **Recipe Creation**: Build recipes by selecting ingredients and specifying quantities
-   **Step Management**: Add detailed step-by-step instructions with optional duration
-   **Macro Calculation**: Automatically calculate total macros per serving
-   **User Authentication**: Secure user accounts with Supabase
-   **Public Recipes**: Share recipes publicly with view tracking

## Technologies

-   **Next.js 14** (App Router) - React framework for building web applications
-   **TypeScript** - Type-safe JavaScript
-   **Tailwind CSS** - Utility-first CSS framework
-   **Prisma** - Database ORM (Object-Relational Mapping)
-   **Supabase** - Backend as a Service (authentication & PostgreSQL database)

## Documentation

**📘 [STARTER_GUIDE.md](./STARTER_GUIDE.md)** - **Start here!** Comprehensive guide for new developers covering:

-   How Next.js, TypeScript, Tailwind, Prisma, and Supabase work
-   How to add components, routes, and API endpoints
-   How to make database calls
-   Project structure and common patterns
-   Where to go to add features and fix bugs

**🎨 [CSS_CLASS_REFERENCE.md](./CSS_CLASS_REFERENCE.md)** - Reference for custom CSS classes used in the application

## Available Scripts

-   `npm run dev` - Start development server
-   `npm run build` - Build for production
-   `npm run start` - Start production server
-   `npm run lint` - Run ESLint
-   `npm run clean` - Remove build files
-   `npm run db:generate` - Generate Prisma client
-   `npm run db:push` - Push schema changes to database
-   `npm run db:studio` - Open Prisma Studio (database GUI)

## Project Structure

```
menu/
├── app/                    # Next.js App Router (all your code goes here)
│   ├── api/               # API routes (backend endpoints)
│   ├── components/        # Reusable React components
│   ├── contexts/          # React contexts (like AuthContext)
│   ├── lib/               # Utility libraries (Prisma, Supabase clients)
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Helper functions
│   └── [pages]/           # Route pages
├── prisma/                # Database schema and migrations
└── [config files]         # Configuration files
```

See [STARTER_GUIDE.md](./STARTER_GUIDE.md) for detailed explanations of each directory.

## Getting Help

-   **New to these technologies?** Start with [STARTER_GUIDE.md](./STARTER_GUIDE.md)
-   **Need to understand the codebase structure?** See [STARTER_GUIDE.md](./STARTER_GUIDE.md) - Project Structure section
-   **Want to add a feature?** See [STARTER_GUIDE.md](./STARTER_GUIDE.md) - Common Tasks section
