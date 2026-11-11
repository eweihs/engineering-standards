# File Organisation Guidelines

## Placement

### Used Once

Keep the file next to its consumer.

Example:

```txt
src/
  OrderPage.tsx
  OrderList.tsx
```

### Used Multiple Times

Promote to the nearest common location.

Example:

```txt
src/
  components/
    ProductCard.tsx
```

## Size

Keep a file under 300 lines of code, not counting blank lines and comments. ESLint blocks larger files. Split a file that grows past it by responsibility, not by cutting it in half.

Tests and generated or vendored code, such as `components/ui`, are exempt.

## Utilities

Pure functions belong in the project's utilities folder (`src/lib` or `src/utils`).

Example:

```txt
src/
  lib/
    format-price.ts
```

## Types

Co-locate initially.

Extract only when reused.

## Constants

Group constants by domain.

Example:

```txt
src/
  constants/
    products.ts
```

## Imports

Allowed:

```ts
import { ProductCard } from "./ProductCard";
import { formatPrice } from "@/lib/format-price";
```

Avoid deep relative imports. Use the project's path alias instead.

## Exports

Single export:

```ts
export default function formatPrice() {}
```

Multiple exports:

```ts
export const formatPrice = () => {};
export const parsePrice = () => {};
```

Follow framework conventions where they differ, such as named class exports in NestJS.
