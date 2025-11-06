# Recipe Menu

A Next.js application for inputting and viewing recipes with detailed ingredient macros and step-by-step instructions.

## Features

-   **Ingredients Management**: Create and manage ingredients with detailed macro information (calories, protein, carbs, fat, fiber, sugar) per serving
-   **Recipe Creation**: Build recipes by selecting ingredients and specifying quantities
-   **Step Management**: Add detailed step-by-step instructions with optional duration
-   **Macro Calculation**: Automatically calculate total macros per serving based on recipe ingredients
-   **Recipe Viewing**: View all recipes with calculated macros, ingredients, and organized steps
-   Persistent storage using localStorage (ready for MySQL migration)

## Data Model

The application uses a relational data structure with separate tables:

-   **Ingredients**: Stores ingredient information with macros per serving
-   **Recipes**: Stores recipe metadata (name, description, servings)
-   **RecipeIngredients**: Junction table linking recipes to ingredients with quantities
-   **Steps**: Stores step-by-step instructions for each recipe

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. **Add Ingredients**: Navigate to the Ingredients page and add ingredients with their macro information
2. **Create Recipes**: Go to Add Recipe page, select ingredients from your list, specify quantities, and add step-by-step instructions
3. **View Recipes**: View all recipes on the home page with calculated macros and organized steps

## Project Structure

-   `app/` - Next.js App Router directory
    -   `page.tsx` - Home page with recipe list and calculated macros
    -   `add/page.tsx` - Add recipe form with ingredient selection and step management
    -   `ingredients/page.tsx` - Ingredients management page
    -   `layout.tsx` - Root layout with navigation
    -   `globals.css` - Global styles
    -   `types/recipe.ts` - TypeScript types for ingredients, steps, recipes
    -   `utils/storage.ts` - LocalStorage utilities for all tables

## Technologies

-   Next.js 14 (App Router)
-   React 18
-   TypeScript
-   Tailwind CSS
-   Dark Mode Support

## Documentation

-   **STARTER_GUIDE.md** - Comprehensive guide for understanding and modifying the project
-   **PROJECT_STRUCTURE.md** - Detailed file structure and dependencies

## Cleanup

To clean build files:

```bash
# Remove .next build directory
npm run clean

# Remove everything (including node_modules) - use with caution
npm run clean:all
```

## Future Enhancements

-   MySQL database integration (currently using localStorage)
-   Unit conversion for ingredient quantities
-   Recipe editing functionality
-   Recipe search and filtering
-   Export recipes functionality

## Documentation

For detailed guides on understanding and modifying the project:

-   See **STARTER_GUIDE.md** for development guide
-   See **PROJECT_STRUCTURE.md** for file structure
