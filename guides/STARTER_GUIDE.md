# Starter Guide: Recipe Menu Development

Welcome! This guide assumes you have programming experience but are new to Next.js, TypeScript, Tailwind CSS, Prisma, and Supabase. Let's get you up to speed so you can start building features and fixing bugs.

## Table of Contents

1. [Understanding the Technologies](#understanding-the-technologies)
2. [Project Setup](#project-setup)
3. [Project Structure](#project-structure)
4. [How to Add Components](#how-to-add-components)
5. [How to Add Routes (Pages)](#how-to-add-routes-pages)
6. [How to Make Database Calls](#how-to-make-database-calls)
7. [How to Add API Endpoints](#how-to-add-api-endpoints)
8. [How to Style Components](#how-to-style-components)
9. [Authentication Flow](#authentication-flow)
10. [Common Tasks](#common-tasks)
11. [Where to Find Things](#where-to-find-things)

---

## Understanding the Technologies

### Next.js (React Framework)

**What it is:** Next.js is a framework built on React that handles routing, server-side rendering, and API routes. Think of it as "React with batteries included."

**Key Concepts:**

-   **App Router:** Next.js uses a file-based routing system. Files in `app/` become routes.
    -   `app/page.tsx` → `/` (home page)
    -   `app/about/page.tsx` → `/about`
    -   `app/users/[id]/page.tsx` → `/users/123` (dynamic route)
-   **Server vs Client Components:** By default, components run on the server. Add `"use client"` at the top to make it a client component (needed for hooks, interactivity).
-   **API Routes:** Files in `app/api/` create backend endpoints accessible via HTTP.

**Example:**

```tsx
// app/about/page.tsx
export default function AboutPage() {
	return <div>About Us</div>;
}
```

This automatically creates a route at `/about`.

### TypeScript

**What it is:** TypeScript is JavaScript with types. It helps catch errors before runtime.

**Key Concepts:**

-   **Types:** Define what data structure looks like
    ```typescript
    interface User {
    	id: string;
    	email: string;
    	name: string;
    }
    ```
-   **Type Safety:** TypeScript will warn you if you use the wrong type
-   **Interfaces vs Types:** Mostly interchangeable, interfaces are preferred for objects

**Example:**

```typescript
// This will cause a TypeScript error:
const user: User = { id: "123" }; // Missing email and name!

// This is correct:
const user: User = {
	id: "123",
	email: "test@example.com",
	name: "Test User",
};
```

### Tailwind CSS

**What it is:** A utility-first CSS framework. Instead of writing custom CSS, you use pre-made utility classes.

**Key Concepts:**

-   **Utility Classes:** Small, single-purpose classes like `bg-blue-500`, `text-center`, `p-4`
-   **Responsive Design:** Add prefixes like `md:`, `lg:` for different screen sizes
-   **Dark Mode:** Use `dark:` prefix for dark mode styles

**Example:**

```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600">
	Click me
</div>
```

This creates a blue button with white text, padding, rounded corners, and a hover effect - all without writing any CSS!

### Prisma (Database ORM)

**What it is:** Prisma is an ORM (Object-Relational Mapping) that lets you interact with your database using TypeScript instead of SQL.

**Key Concepts:**

-   **Schema:** Defined in `prisma/schema.prisma` - this is your database structure
-   **Client:** Generated from schema - use it to query the database
-   **Models:** Each model in the schema becomes a table in the database

**Example:**

```typescript
// In your code:
const user = await prisma.user.findUnique({
	where: { id: "123" },
});

// This generates SQL like:
// SELECT * FROM "User" WHERE id = '123'
```

### Supabase

**What it is:** Supabase provides authentication and a PostgreSQL database (hosted for you).

**Key Concepts:**

-   **Authentication:** Handles user sign-up, login, sessions
-   **Database:** PostgreSQL database that Prisma talks to
-   **Row Level Security (RLS):** Database-level security (optional, we use Prisma filtering instead)

**How we use it:**

-   **Auth:** Users sign up/login through Supabase
-   **Database:** Prisma connects to Supabase's PostgreSQL database
-   **Sessions:** Supabase manages user sessions (stored in browser)

---

## Project Setup

### 1. Install Dependencies

```bash
npm install
```

This installs all packages listed in `package.json`.

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase (get these from https://supabase.com)
# Note: NEXT_PUBLIC_ prefix is required for client-side access in Next.js
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Database connection string (from Supabase dashboard)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project.supabase.co:5432/postgres
```

**Where to find these values:**

1. Go to https://supabase.com and create a project
2. **NEXT_PUBLIC_SUPABASE_URL:** Settings → API → Project URL
3. **NEXT_PUBLIC_SUPABASE_ANON_KEY:** Settings → API → anon/public key
4. **DATABASE_URL:** Settings → Database → Connection string → URI format (replace `[YOUR-PASSWORD]` with your database password)

**Important:** The `NEXT_PUBLIC_` prefix is required because Supabase is used in client-side components. Next.js only exposes environment variables with this prefix to the browser.

### 3. Set Up Database Schema

```bash
npm run db:generate  # Generates Prisma client from schema
npm run db:push      # Creates tables in your database
```

This reads `prisma/schema.prisma` and creates the actual database tables.

### 4. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

---

## Project Structure

```
menu/
├── app/                          # All your application code
│   ├── api/                      # Backend API routes
│   │   ├── ingredients/route.ts  # /api/ingredients endpoint
│   │   └── recipes/route.ts      # /api/recipes endpoint
│   ├── components/               # Reusable React components
│   │   ├── IngredientModal.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ...
│   ├── contexts/                 # React Context providers
│   │   └── AuthContext.tsx       # Provides auth state globally
│   ├── lib/                      # Third-party library setups
│   │   ├── prisma.ts            # Prisma client instance
│   │   ├── supabase.ts          # Supabase client instance
│   │   ├── api-auth.ts          # API authentication helpers
│   │   └── api-client.ts        # Frontend API client helper
│   ├── types/                    # TypeScript type definitions
│   │   └── recipe.ts            # Types for Recipe, Ingredient, etc.
│   ├── utils/                    # Helper functions
│   │   ├── storage-api.ts       # Database operations (use this!)
│   │   ├── calculations.ts      # Macro calculations
│   │   └── storage.ts           # OLD - don't use (localStorage)
│   ├── page.tsx                  # Home page (/)
│   ├── add/page.tsx              # Add recipe page (/add)
│   ├── ingredients/page.tsx      # Ingredients page (/ingredients)
│   ├── login/page.tsx            # Login page (/login)
│   ├── public/page.tsx           # Public recipes (/public)
│   ├── layout.tsx                # Root layout (wraps all pages)
│   └── globals.css               # Global styles
├── prisma/
│   └── schema.prisma             # Database schema definition
└── [config files]                # next.config.js, tsconfig.json, etc.
```

### Key Directories Explained

**`app/api/`** - Backend endpoints. These are server-side only (no `"use client"` needed). Handle HTTP requests, database operations, authentication.

**`app/components/`** - Reusable UI components. Usually client components (need `"use client"`).

**`app/lib/`** - Singleton instances of libraries. Prisma client, Supabase client, etc. Import these rather than creating new instances.

**`app/utils/`** - Pure functions and utilities. No side effects, just logic.

**`app/types/`** - TypeScript type definitions. Shared across the app.

---

## How to Add Components

Components are reusable pieces of UI. They live in `app/components/`.

### Step 1: Create the Component File

```tsx
// app/components/Button.tsx
"use client"; // Needed for interactivity (onClick, useState, etc.)

interface ButtonProps {
	label: string;
	onClick: () => void;
	variant?: "primary" | "secondary";
}

export default function Button({
	label,
	onClick,
	variant = "primary",
}: ButtonProps) {
	return (
		<button
			onClick={onClick}
			className={`
        px-4 py-2 rounded
        ${
			variant === "primary"
				? "bg-blue-500 text-white"
				: "bg-gray-200 text-gray-800"
		}
        hover:opacity-80
      `}
		>
			{label}
		</button>
	);
}
```

**Key Points:**

-   `"use client"` at the top for client components (most components need this)
-   TypeScript interface for props
-   Export as default function
-   Use Tailwind classes for styling

### Step 2: Use the Component

```tsx
// app/page.tsx
import Button from "./components/Button";

export default function HomePage() {
	const handleClick = () => {
		console.log("Clicked!");
	};

	return (
		<div>
			<Button label="Click me" onClick={handleClick} />
			<Button
				label="Secondary"
				onClick={handleClick}
				variant="secondary"
			/>
		</div>
	);
}
```

### Example: Adding a New Modal

Let's say you want to add a confirmation modal:

```tsx
// app/components/ConfirmModal.tsx
"use client";

interface ConfirmModalProps {
	isOpen: boolean;
	title: string;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
}

export default function ConfirmModal({
	isOpen,
	title,
	message,
	onConfirm,
	onCancel,
}: ConfirmModalProps) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
				<h2 className="text-xl font-bold mb-4">{title}</h2>
				<p className="mb-6">{message}</p>
				<div className="flex gap-4 justify-end">
					<button
						onClick={onCancel}
						className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:opacity-80"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className="px-4 py-2 bg-red-500 text-white rounded hover:opacity-80"
					>
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
}
```

---

## How to Add Routes (Pages)

In Next.js App Router, routes are created by adding `page.tsx` files in the `app/` directory.

### Simple Route

```tsx
// app/contact/page.tsx
export default function ContactPage() {
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-4">Contact Us</h1>
			<p>Get in touch!</p>
		</div>
	);
}
```

This creates a route at `/contact`.

### Route with Client Interactivity

```tsx
// app/settings/page.tsx
"use client"; // Need this for useState, useEffect, etc.

import { useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";

function SettingsContent() {
	const [theme, setTheme] = useState("light");

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-4">Settings</h1>
			<select value={theme} onChange={(e) => setTheme(e.target.value)}>
				<option value="light">Light</option>
				<option value="dark">Dark</option>
			</select>
		</div>
	);
}

export default function SettingsPage() {
	return (
		<ProtectedRoute>
			<SettingsContent />
		</ProtectedRoute>
	);
}
```

### Dynamic Routes

```tsx
// app/recipes/[id]/page.tsx
"use client";

import { use } from "react"; // Next.js uses React.use() for params

export default function RecipePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params); // Unwrap the params promise

	return (
		<div>
			<h1>Recipe {id}</h1>
			{/* Fetch and display recipe */}
		</div>
	);
}
```

This creates routes like `/recipes/123`, `/recipes/456`, etc.

---

## How to Make Database Calls

### Option 1: Using the Storage Hook (Recommended)

The easiest way is to use the `useStorage()` hook, which handles all API calls for you:

```tsx
// app/my-page/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useStorage } from "../utils/storage-api";
import { Ingredient } from "../types/recipe";

export default function MyPage() {
	const storage = useStorage();
	const [ingredients, setIngredients] = useState<Ingredient[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadData() {
			try {
				const data = await storage.getIngredients();
				setIngredients(data);
			} catch (error) {
				console.error("Failed to load ingredients:", error);
			} finally {
				setLoading(false);
			}
		}
		loadData();
	}, []);

	const handleAddIngredient = async () => {
		const newIngredient = await storage.saveIngredient({
			name: "Chicken Breast",
			macrosPerServing: {
				protein: 31,
				carbs: 0,
				fat: 3.6,
				fiber: 0,
				sugar: 0,
			},
		});
		setIngredients([...ingredients, newIngredient]);
	};

	if (loading) return <div>Loading...</div>;

	return (
		<div>
			<button onClick={handleAddIngredient}>Add Ingredient</button>
			{ingredients.map((ing) => (
				<div key={ing.id}>{ing.name}</div>
			))}
		</div>
	);
}
```

**Available storage methods:**

-   `storage.getIngredients()` - Get all ingredients
-   `storage.saveIngredient(ingredient)` - Create ingredient
-   `storage.deleteIngredient(id)` - Delete ingredient
-   `storage.getRecipes()` - Get all recipes
-   `storage.saveRecipe(recipe)` - Create recipe
-   `storage.deleteRecipe(id)` - Delete recipe

See `app/utils/storage-api.ts` for the full list.

### Option 2: Direct API Calls

If you need more control, you can call API endpoints directly:

```tsx
"use client";

import { useApiClient } from "../lib/api-client";

export default function MyPage() {
	const api = useApiClient();

	const fetchData = async () => {
		try {
			// GET request
			const recipes = await api.get("/api/recipes");

			// POST request
			const newRecipe = await api.post("/api/recipes", {
				name: "My Recipe",
				description: "A tasty recipe",
				servings: 4,
			});

			// DELETE request
			await api.delete("/api/recipes?id=123");
		} catch (error) {
			console.error("API error:", error);
		}
	};

	return <button onClick={fetchData}>Fetch Data</button>;
}
```

The `useApiClient()` hook automatically adds authentication headers.

### Option 3: Direct Prisma (Server-Side Only)

You can only use Prisma directly in server components or API routes (not in client components):

```tsx
// app/api/recipes/route.ts (API route - server-side)
import { prisma } from "../../lib/prisma";

export async function GET() {
	const recipes = await prisma.recipe.findMany({
		where: { userId: "user-id" },
		include: {
			recipeIngredients: {
				include: {
					ingredient: true,
				},
			},
		},
	});

	return Response.json(recipes);
}
```

**Important:** Never import `prisma` in client components (components with `"use client"`). Always use API routes or the `useStorage()` hook.

---

## How to Add API Endpoints

API endpoints are server-side routes that handle HTTP requests. They live in `app/api/`.

### Example: GET Endpoint

```tsx
// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { withAuth } from "../../lib/api-auth";

export const GET = withAuth(async (request: NextRequest, user) => {
	try {
		// Get current user's profile
		const userProfile = await prisma.user.findUnique({
			where: { id: user.id },
		});

		return NextResponse.json(userProfile);
	} catch (error) {
		console.error("Error fetching user:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
});
```

### Example: POST Endpoint

```tsx
// app/api/users/route.ts
export const POST = withAuth(async (request: NextRequest, user) => {
	try {
		const body = await request.json();
		const { name } = body;

		// Update user
		const updatedUser = await prisma.user.update({
			where: { id: user.id },
			data: { name },
		});

		return NextResponse.json(updatedUser);
	} catch (error) {
		console.error("Error updating user:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
});
```

### Example: DELETE Endpoint

```tsx
// app/api/recipes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { withAuth } from "../../../lib/api-auth";

export const DELETE = withAuth(
	async (
		request: NextRequest,
		user,
		{ params }: { params: Promise<{ id: string }> }
	) => {
		try {
			const { id } = await params;

			// Verify recipe belongs to user
			const recipe = await prisma.recipe.findUnique({
				where: { id },
			});

			if (!recipe || recipe.userId !== user.id) {
				return NextResponse.json(
					{ error: "Not found" },
					{ status: 404 }
				);
			}

			// Delete recipe (cascade deletes related records)
			await prisma.recipe.delete({
				where: { id },
			});

			return NextResponse.json({ success: true });
		} catch (error) {
			console.error("Error deleting recipe:", error);
			return NextResponse.json(
				{ error: "Internal server error" },
				{ status: 500 }
			);
		}
	}
);
```

### Key Points:

1. **No `"use client"`** - API routes run on the server
2. **Export HTTP methods** - `GET`, `POST`, `PUT`, `DELETE`, etc.
3. **Use `withAuth`** - Wraps the handler and provides authenticated user
4. **Use Prisma directly** - You can query the database here
5. **Return NextResponse** - Use `NextResponse.json()` to return JSON

### Public Endpoint (No Authentication)

```tsx
// app/api/recipes/public/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request: NextRequest) {
	// No withAuth wrapper - anyone can access
	const recipes = await prisma.recipe.findMany({
		where: { isPublic: true },
	});

	return NextResponse.json(recipes);
}
```

---

## How to Style Components

We use Tailwind CSS. Instead of writing CSS files, you use utility classes.

### Basic Styling

```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg">Content here</div>
```

**Classes used:**

-   `bg-blue-500` - Blue background
-   `text-white` - White text
-   `p-4` - Padding on all sides
-   `rounded-lg` - Rounded corners

### Responsive Design

```tsx
<div className="text-sm md:text-base lg:text-lg">
	This text is small on mobile, base on tablet, large on desktop
</div>
```

### Dark Mode

```tsx
<div className="bg-white dark:bg-gray-800 text-black dark:text-white">
	Adapts to light/dark mode
</div>
```

### Common Patterns

**Button:**

```tsx
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">
	Click me
</button>
```

**Card:**

```tsx
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
	Card content
</div>
```

**Container:**

```tsx
<div className="container mx-auto px-4 py-8">Centered content with padding</div>
```

**Flexbox:**

```tsx
<div className="flex items-center justify-between gap-4">
	<div>Left</div>
	<div>Right</div>
</div>
```

**Grid:**

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
	<div>Item 1</div>
	<div>Item 2</div>
	<div>Item 3</div>
</div>
```

### Custom Colors (if needed)

Edit `tailwind.config.js` to add custom colors, then use them like `bg-brand-primary`.

---

## Authentication Flow

### How Authentication Works

1. **User signs up/logs in** → Supabase creates a session
2. **Session stored in browser** → Supabase handles this automatically
3. **AuthContext provides session** → Available throughout the app via `useAuth()`
4. **API routes verify session** → `withAuth()` wrapper checks authentication
5. **Protected routes redirect** → `ProtectedRoute` component checks auth state

### Protecting a Page

```tsx
// app/settings/page.tsx
"use client";

import ProtectedRoute from "../components/ProtectedRoute";

function SettingsContent() {
	return <div>Settings page</div>;
}

export default function SettingsPage() {
	return (
		<ProtectedRoute>
			<SettingsContent />
		</ProtectedRoute>
	);
}
```

If user is not logged in, they're redirected to `/login`.

### Using Auth State in Components

```tsx
"use client";

import { useAuth } from "../contexts/AuthContext";

export default function MyComponent() {
	const { user, session, loading, signOut } = useAuth();

	if (loading) return <div>Loading...</div>;
	if (!user) return <div>Not logged in</div>;

	return (
		<div>
			<p>Logged in as {user.email}</p>
			<button onClick={signOut}>Sign Out</button>
		</div>
	);
}
```

### Available Auth Methods

-   `signUp(email, password)` - Create new account
-   `signIn(email, password)` - Log in
-   `signOut()` - Log out
-   `user` - Current user object (or null)
-   `session` - Current session (includes access_token)
-   `loading` - Whether auth state is being checked

---

## Common Tasks

### Adding a New Feature

1. **Plan the data structure** - Do you need new database tables? Update `prisma/schema.prisma`
2. **Run migrations** - `npm run db:push`
3. **Create API endpoints** - Add routes in `app/api/`
4. **Update storage hook** - Add methods to `app/utils/storage-api.ts`
5. **Create UI components** - Build the user interface
6. **Create/update pages** - Add routes for the new feature

### Fixing a Bug

1. **Reproduce the bug** - Understand what's happening
2. **Find the relevant code** - Use the [Where to Find Things](#where-to-find-things) section
3. **Add logging** - `console.log()` to understand the flow
4. **Fix the issue** - Make your changes
5. **Test thoroughly** - Check edge cases

### Modifying Database Schema

1. **Edit `prisma/schema.prisma`** - Add/modify models
2. **Run `npm run db:push`** - Updates database (development)
3. **Test your changes** - Make sure everything still works
4. **Update TypeScript types** - If you added fields, update types in `app/types/`

### Adding a New Page

1. **Create `app/your-page/page.tsx`**
2. **Add navigation link** - Update `app/components/Navbar.tsx` or similar
3. **Protect if needed** - Wrap with `ProtectedRoute`

### Debugging Database Queries

Use Prisma Studio to inspect your database:

```bash
npm run db:studio
```

This opens a GUI at http://localhost:5555 where you can browse and edit data.

---

## Where to Find Things

### "Where do I add a new button/component?"

**Answer:** Create a new file in `app/components/` or add it to the relevant page.

### "Where do I change the database structure?"

**Answer:** Edit `prisma/schema.prisma`, then run `npm run db:push`.

### "Where do I add a new page/route?"

**Answer:** Create a new folder in `app/` with a `page.tsx` file inside.

### "Where do I make API calls to the database?"

**Answer:**

-   **From client components:** Use `useStorage()` hook from `app/utils/storage-api.ts`
-   **In API routes:** Use `prisma` directly from `app/lib/prisma.ts`

### "Where do I add a new API endpoint?"

**Answer:** Create a new file in `app/api/your-endpoint/route.ts`.

### "Where do I change styling?"

**Answer:** Use Tailwind classes directly in your components. For global styles, edit `app/globals.css`.

### "Where are TypeScript types defined?"

**Answer:** `app/types/recipe.ts` - add new types here.

### "Where do I see what data models exist?"

**Answer:** `prisma/schema.prisma` - this defines all database tables.

### "Where is authentication handled?"

**Answer:**

-   **Auth logic:** `app/contexts/AuthContext.tsx`
-   **Login page:** `app/login/page.tsx`
-   **Protection:** `app/components/ProtectedRoute.tsx`
-   **API auth:** `app/lib/api-auth.ts`

### "Where do I add business logic/calculations?"

**Answer:** `app/utils/calculations.ts` or create a new file in `app/utils/`.

---

## Quick Reference

### Common Prisma Queries

```typescript
// Find one
const user = await prisma.user.findUnique({
	where: { id: "123" },
});

// Find many
const recipes = await prisma.recipe.findMany({
	where: { userId: "123" },
	orderBy: { createdAt: "desc" },
});

// Create
const recipe = await prisma.recipe.create({
	data: {
		name: "My Recipe",
		userId: "123",
		servings: 4,
	},
});

// Update
const updated = await prisma.recipe.update({
	where: { id: "123" },
	data: { name: "Updated Name" },
});

// Delete
await prisma.recipe.delete({
	where: { id: "123" },
});

// Include related data
const recipe = await prisma.recipe.findUnique({
	where: { id: "123" },
	include: {
		recipeIngredients: {
			include: {
				ingredient: true,
			},
		},
		steps: true,
	},
});
```

### Common Tailwind Classes

-   Spacing: `p-4`, `px-4`, `py-4`, `m-4`, `gap-4`
-   Colors: `bg-blue-500`, `text-white`, `border-gray-300`
-   Sizing: `w-full`, `h-screen`, `max-w-md`
-   Flexbox: `flex`, `items-center`, `justify-between`
-   Grid: `grid`, `grid-cols-3`, `gap-4`
-   Typography: `text-xl`, `font-bold`, `text-center`
-   Borders: `rounded`, `border`, `shadow-md`
-   States: `hover:bg-blue-600`, `disabled:opacity-50`

### Common React Patterns

```tsx
// useState
const [count, setCount] = useState(0);

// useEffect (runs on mount)
useEffect(() => {
	// Do something
}, []);

// useEffect (runs when dependency changes)
useEffect(() => {
	// Do something
}, [count]);

// Event handler
const handleClick = () => {
	setCount(count + 1);
};

// Async function in useEffect
useEffect(() => {
	async function loadData() {
		const data = await fetch("/api/data");
	}
	loadData();
}, []);
```

---

## Getting Help

-   **Next.js Docs:** https://nextjs.org/docs
-   **TypeScript Docs:** https://www.typescriptlang.org/docs/
-   **Tailwind Docs:** https://tailwindcss.com/docs
-   **Prisma Docs:** https://www.prisma.io/docs
-   **Supabase Docs:** https://supabase.com/docs

---

## Next Steps

1. **Explore the codebase** - Read through existing components and pages
2. **Try making a small change** - Add a button, change some text
3. **Make a small feature** - Add a new page or modify an existing one
4. **Read the code** - The best way to learn is to read working code

Good luck! 🚀
