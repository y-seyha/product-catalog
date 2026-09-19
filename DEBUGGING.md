# Product Catalog

React + TypeScript mini-app focused on strong typing and debugging.

## TypeScript

- Typed `Product`, form, error, and component props.
- Typed `ChangeEvent` and `FormEvent` handlers.
- `useState<Product[]>` for product data.
- Used `Omit` and `Partial` for derived types.
- Used optional chaining (`?.`) and nullish coalescing (`??`).

## TypeScript Check

```bash
npx tsc --noEmit
```

The project passes the TypeScript check with no implicit `any`.

## Screenshot

### TypeScript Error

.map() on Null State

![TypeScript error](./src/assets/null-state-bug.png)

.wrong value

![TypeScript error](./src/assets/wrong-valu-bug.png)
