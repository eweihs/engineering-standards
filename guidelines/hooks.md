# Hook Guidelines

## Keep State Local

State should live as close as possible to where it is used.

## Extract Hooks When

### Logic Is Reused

If multiple components use the same React logic:

```tsx
useProductSearch()
```

### State Becomes Coupled

If handlers or effects coordinate multiple pieces of state:

```tsx
const [query, setQuery] = useState("");
const [results, setResults] = useState([]);
const [selectedIndex, setSelectedIndex] = useState(-1);
```

consider extracting a hook.

## External System Synchronisation

Prefer hooks for:

- URL synchronisation
- localStorage
- DOM events
- data fetching

Examples:

```tsx
usePointerPosition()
useLocalStorage()
useProductSearch()
```

## Avoid Premature Hooks

If logic is only used once and remains simple, keep it inline.
