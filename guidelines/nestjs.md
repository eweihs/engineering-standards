# NestJS Guidelines

These rules start from one production backend. Revise them as more apps adopt them.

## Structure

Organise code by feature:

```txt
src/
  orders/
    orders.controller.ts
    orders.service.ts
    orders.repository.ts
    orders.dto.ts
    orders.guard.ts
  utils/
```

## Layers

- **Controllers** handle HTTP concerns and delegate to services.
- **Services** hold business logic.
- **Repositories** are the only layer that talks to the database.

## Validation

Every request body is a DTO validated with `class-validator`.

Enable `ValidationPipe` with `whitelist: true` so unknown properties are dropped.

## Authorisation

The backend is the source of truth for access control. Frontend guards only improve the user experience.

Protect routes with guards, not with checks inside handlers.

## API Contract

Keep the OpenAPI document in sync with the controllers.

Return a stable, machine-readable error code alongside the message. Clients should branch on the code, never on the message text.

## Email

Escape user-supplied values before placing them in HTML. Do not store reset keys or other secrets in logs.
