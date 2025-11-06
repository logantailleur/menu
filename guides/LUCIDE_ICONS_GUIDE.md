# Lucide React Icons Usage Guide

## Quick Links

-   **Official Website**: https://lucide.dev (Best for browsing/searching icons)
-   **GitHub Repo**: https://github.com/lucide-icons/lucide (Documentation & examples)

## Installation

Already installed! ✅

```bash
npm install lucide-react
```

## Basic Usage

### Import Icons

```tsx
// All icons are imported from lucide-react
import { Heart, Star, Clock, Trash2 } from "lucide-react";
```

### Use in Components

```tsx
import { Heart } from "lucide-react";

export default function MyComponent() {
	return (
		<button>
			<Heart className="w-5 h-5" />
			Like
		</button>
	);
}
```

## Common Patterns

### Button with Icon

```tsx
<button className="flex items-center gap-2">
	<Trash2 className="w-4 h-4" />
	Delete
</button>
```

### Icon Only Button

```tsx
<button>
	<X className="w-5 h-5" />
</button>
```

### Conditional Icons

```tsx
{
	isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />;
}
```

### Icon with Text

```tsx
<div className="flex items-center gap-1">
	<Eye className="w-4 h-4" />
	<span>42 views</span>
</div>
```

## Sizing Guidelines

-   **Extra Small**: `w-3 h-3` (12px) - Inline text icons
-   **Small**: `w-4 h-4` (16px) - Buttons, badges
-   **Medium**: `w-5 h-5` (20px) - Default button size
-   **Large**: `w-6 h-6` (24px) - Headers, prominent features
-   **Extra Large**: `w-8 h-8` (32px) - Hero sections

## Styling with Tailwind

### Colors

```tsx
<Heart className="w-5 h-5 text-red-500" />
<Star className="w-5 h-5 text-yellow-400" />
```

### Hover Effects

```tsx
<Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
```

### Custom Colors (using your theme)

```tsx
<Clock className="w-4 h-4 text-primary-muted" />
<Eye className="w-4 h-4 text-secondary" />
```

## Popular Icons for Recipe App

Here are some icons you might find useful:

-   **Clock** - Timing/duration
-   **Eye** - Views/watch
-   **Globe** - Public/share
-   **Lock** - Private/secure
-   **Trash2** - Delete
-   **Plus** - Add
-   **Pencil** - Edit
-   **Star** - Favorite/rating
-   **Heart** - Like/favorite
-   **Search** - Search
-   **User** - User/profile
-   **ShoppingCart** - Cart/ingredients
-   **Check** - Complete/checkmark
-   **X** - Close/cancel
-   **ArrowRight** - Next/navigate
-   **ArrowLeft** - Previous/back
-   **Menu** - Menu/hamburger
-   **Bookmark** - Save/bookmark
-   **Share2** - Share
-   **Image** - Image/photo

## Icon Variants

Lucide icons are consistent in style - all icons use the same stroke width. You can customize size and color with Tailwind classes.

## Additional Styling Options

Lucide icons support additional props:

```tsx
// Custom stroke width
<Heart className="w-5 h-5" strokeWidth={2} />

// Absolute size
<Heart size={24} />

// Custom color via stroke prop
<Heart className="w-5 h-5" stroke="currentColor" />
```

## Examples from Your Codebase

See `app/components/RecipeCard.tsx` for real examples:

-   Clock for duration
-   Eye for views
-   Globe/Lock for public/private
-   Trash2 for delete

## Finding Icons

1. **Visit lucide.dev** - Search by name or browse categories (1000+ icons!)
2. **TypeScript autocomplete** - If using TypeScript, your IDE should autocomplete icon names
3. **Icon names**: Use PascalCase without "Icon" suffix (e.g., `Heart`, `Trash2`, `ArrowRight`)

## Tips

-   Always use both `w-` and `h-` classes for consistent sizing (or use `size={24}` prop)
-   Use `flex items-center` when combining icons with text
-   Use `gap-1` or `gap-2` for spacing between icon and text
-   Icons inherit text color from parent, so you can style them with text color classes
-   Use `transition-colors` for smooth hover effects
-   Lucide has 1000+ icons - use the search on lucide.dev to find what you need
-   Icon names are PascalCase (e.g., `Trash2`, `ArrowRight`, `ShoppingCart`)
-   Some icons have numbered variants (e.g., `Trash2`, `Share2`) - check the website for all options
