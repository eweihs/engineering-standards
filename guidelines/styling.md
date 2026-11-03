# Styling Guidelines

## Tailwind

Use Tailwind utilities whenever possible.

Do not introduce CSS-in-JS or CSS modules. Global CSS is limited to the Tailwind setup, theme tokens and base styles.

## Design Tokens

Use theme tokens for colours and fonts instead of hard-coded values. Each project defines its own brand tokens.

## cn()

Use `cn()` directly in JSX by default:

```tsx
<div className={cn("rounded-lg p-4", isActive && "bg-primary")}>
```

Extract to a named constant only when the class list is used in **more than one place**:

```tsx
// module level — static classes shared across elements
const productRowClasses = cn("flex items-center gap-3 px-4 py-3");

// inside component — dynamic classes shared across elements
const btnClasses = cn("rounded px-3 py-1", disabled && "opacity-30");
```

Never extract a single-use class list into a variable — it adds indirection without benefit.

### Where to declare

- **Module level** when the value is static (no props or state involved) — declared once, never re-evaluated.
- **Inside the component** when the value depends on props or state.

## Never Generate Tailwind Classes Dynamically

Avoid:

```tsx
cn(`bg-${color}`)
cn("bg-" + color)
```

Use explicit mappings instead.

## Spacing

Use Tailwind spacing tokens whenever possible.

Good:

```tsx
p-4
gap-6
mt-2
```

Use arbitrary values only when the spacing does not exist on the scale.

## SVGs

SVGs should inherit color from the parent.

Use:

```svg
fill="currentColor"
stroke="currentColor"
```

Apply colours through Tailwind text-* utilities.
