# Component Guidelines

## Single Responsibility

Components should represent one clear concept.

Good:

- OrderPage
- ProductList
- ProductCard
- SearchInput

Avoid components with multiple unrelated responsibilities.

## Extract Nameable Concepts

If a JSX block represents a clear UI concept, extract it.

Before:

```tsx
<div>
  <input />
  <button>Search</button>
</div>
```

After:

```tsx
<SearchBar />
```

## Smart vs Dumb Components

### Smart Components

May:

- Fetch data
- Coordinate child components
- Define handle* functions

Example:

```tsx
const handleSave = () => {};
```

### Dumb Components

Should:

- Render data
- Handle local UI state
- Avoid coordinating other components

## Flatten Composition

Avoid deeply nested composition chains.

Prefer:

```tsx
<SearchButton />
```

instead of:

```tsx
<button>
  <SearchIcon />
</button>
```

when the pattern is reused.

## Component Naming

Names should describe what the component is.

Good:

```txt
ProductCard.tsx
OrderSummary.tsx
SearchBar.tsx
```

Avoid:

```txt
ShopCheckoutProductCard.tsx
ProductCardForOrderScreen.tsx
```

The folder structure already provides context.

## JSX Hygiene

Extract calculations before return.

Good:

```tsx
const filteredProducts = products.filter((product) =>
  product.name.includes(searchTerm),
);
```

Bad:

```tsx
return products
  .filter(...)
  .map(...)
```

## Test IDs

Smart entry components should export a test id constant.

Example:

```tsx
export const OrderPageTestId = "OrderPage";
```

Use it on the root element:

```tsx
<div data-testid={OrderPageTestId}>
```
