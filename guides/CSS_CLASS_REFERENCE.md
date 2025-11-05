# CSS Class Reference Guide

This guide explains the simplified CSS class system used throughout the application.

## Color System

### Primary Colors (Navy Blue)
- `.bg-primary` - Main background
- `.bg-primary-light` - Light background variant
- `.bg-primary-dark` - Dark background variant
- `.text-primary` - Main text color
- `.text-primary-muted` - Muted text color
- `.text-primary-light` - Light text color
- `.border-primary` - Primary border color

### Secondary Colors (Action Green)
- `.bg-secondary` - Secondary background
- `.bg-secondary-light` - Light secondary background
- `.bg-secondary-hover` - Hover state for secondary
- `.text-secondary` - Secondary text color
- `.text-secondary-dark` - Dark secondary text
- `.border-secondary` - Secondary border color

### Tertiary Colors (Accent)
- `.bg-tertiary` - Gradient accent background
- `.bg-tertiary-hover` - Hover state for tertiary

## Components

### Cards
- `.card` - Base card styling
- `.card-header` - Header card (navigation)
- `.card-body` - Body card (content)
- `.card-small` - Small card variant

### Buttons
- `.btn` - Base button styling
- `.btn-primary` - Primary action button (gradient)
- `.btn-secondary` - Secondary button
- `.btn-danger` - Danger/delete button
- `.btn-small` - Small button variant
- `.btn-full` - Full width button (responsive)

### Forms
- `.input` - Text input styling
- `.input-disabled` - Disabled input styling
- `.textarea` - Textarea input styling
- `.label` - Form label styling

### Navigation
- `.nav-link` - Navigation link
- `.nav-link-active` - Active navigation link

### Macros Display
- `.macro-card` - Macro information card
- `.macro-card-large` - Large macro card (for calories)
- `.macro-label` - Macro label text
- `.macro-value` - Macro value text
- `.macro-value-large` - Large macro value

### Layout
- `.container` - Page container
- `.container-inner` - Inner container wrapper
- `.heading-1` - Main heading (h1)
- `.heading-2` - Secondary heading (h2)
- `.heading-3` - Tertiary heading (h3)
- `.grid-responsive` - Responsive grid layout

### Modals
- `.modal-overlay` - Modal backdrop
- `.modal-content` - Modal content container
- `.modal-header` - Modal header
- `.close-button` - Close button styling

### Search
- `.search-dropdown` - Search results dropdown
- `.search-item` - Individual search result item
- `.search-item-name` - Search result name
- `.search-item-meta` - Search result metadata
- `.search-empty` - Empty search state

### Steps
- `.step-card` - Step card container
- `.step-number` - Step number badge

### Utilities
- `.empty-state` - Empty state container
- `.empty-state-card` - Empty state card
- `.sticky-sidebar` - Sticky sidebar positioning
- `.sidebar-card` - Sidebar card styling

## Usage Examples

### Creating a Card
```tsx
<div className="card-body">
	<h1 className="heading-1">Title</h1>
	<p className="text-primary-muted">Content</p>
</div>
```

### Creating a Button
```tsx
<button className="btn-primary btn-full">
	Save
</button>
```

### Creating a Form
```tsx
<div>
	<label htmlFor="name" className="label">
		Name <span className="text-red-400">*</span>
	</label>
	<input type="text" id="name" className="input" />
</div>
```

### Creating a Macro Display
```tsx
<div className="macro-card">
	<div className="macro-label">Calories</div>
	<div className="macro-value">250</div>
</div>
```

## Benefits

1. **Semantic**: Class names describe purpose, not appearance
2. **Consistent**: Same classes used throughout the app
3. **Maintainable**: Change colors in one place (globals.css)
4. **Readable**: Easier to understand component structure
5. **Reusable**: Classes can be combined for variations

## Migration Notes

All components have been migrated from complex Tailwind classes to simplified semantic classes. The color system automatically handles dark mode through Tailwind's dark mode feature.

