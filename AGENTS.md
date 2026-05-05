# AGENTS.md — OC Hub Mini-App Template

This is a template for building mini-apps that run inside the Open Campus Hub. It uses Next.js, TypeScript, and Tailwind CSS. Authentication and analytics are already set up — just build your app.

## Critical Rules

- **All API routes MUST use `withAuth`** — never create an unprotected API route. See the API Routes section below.
- **Never build a login/signup flow** — auth is already handled by the Hub iframe.
- **Never remove or modify `app/providers.tsx` or `app/layout.tsx`** — these wire up authentication for the entire app.
- **Never install a different CSS framework** — use Tailwind CSS for all styling.
- **Never use inline `style` props or CSS modules** — always use Tailwind utility classes.
- **Always use brand colors for primary actions** — see Design section below.
- **Always include `'use client'` at the top** of any component that uses hooks, state, event handlers, or browser APIs.

## Project Structure

```
app/            → Pages and API routes
components/     → Reusable UI components
lib/            → Utilities (do not modify these)
public/         → Static assets (images, icons, etc.)
```

Key files you'll work with:
- `app/page.tsx` — The home page. Edit this to build your main UI.
- `components/TabNav.tsx` — The tab navigation bar. Add new tabs here.
- `app/globals.css` — Brand color definitions. Add new colors here.

Files you should NOT modify:
- `app/layout.tsx` — Root layout
- `app/providers.tsx` — Auth provider
- `lib/auth.ts` — API authentication
- `lib/analytics.ts` — Event tracking
- `lib/env.ts` — Environment config

## Design & Styling

### Brand Colors

| Color | Class prefix | Hex | When to use |
|-------|-------------|-----|-------------|
| Brand Blue | `brand-blue` | `#141beb` | Buttons, links, active tabs, primary actions |
| Brand Cyan | `brand-cyan` | `#02eec4` | Accents, highlights, gradients |

Examples: `bg-brand-blue`, `text-brand-blue`, `border-brand-blue`, `bg-brand-cyan`, `text-brand-cyan`

### Standard Patterns

**Primary button:**
```html
<button className="bg-brand-blue text-white rounded-lg px-4 py-2 hover:opacity-90 transition-opacity">
  Click me
</button>
```

**Disabled button** — add `disabled:opacity-50` and the `disabled` prop.

**Active tab / selected item:** use `text-brand-blue border-brand-blue` (see `components/TabNav.tsx`).

**Page layout:**
```tsx
<main className="min-h-screen">
  <TabNav />
  <div className="p-6">
    {/* Your content */}
  </div>
</main>
```

**Section spacing:** wrap sections in `<section className="mb-8">`.

**Headings:** use `text-2xl font-semibold` for page titles, `text-lg font-medium` for section headings.

**Secondary text:** use `text-gray-600` or `text-gray-500`.

**Code/mono text:** `<code className="bg-gray-100 px-1 rounded">`.

### Adding New Colors

Add to the `@theme inline` block in `app/globals.css`:
```css
@theme inline {
  --color-brand-blue: #141beb;
  --color-brand-cyan: #02eec4;
  --color-your-new-color: #hexvalue;
}
```
Then use it as `bg-your-new-color`, `text-your-new-color`, etc.

## Authentication

Auth is delivered via hash fragment token injection. When the app runs inside OC Hub, the hub appends `#id_token=<jwt>&access_token=<jwt>` to the iframe URL. Both tokens are read from the hash and written to localStorage before the OCConnect SDK initializes (see `providers.tsx`), so `useOCAuth()` works seamlessly on first render. In standalone/dev mode (no hash tokens), the app falls back to normal auth.

Here's how to use it:

### Getting the logged-in user in a component

```tsx
'use client';

import { useOCAuth } from '@opencampus/ocid-connect-js';

export function MyComponent() {
  const auth = useOCAuth();
  const authState = auth?.authState;

  if (!authState || authState.isLoading) return <p>Loading...</p>;
  if (!authState.isAuthenticated) return <p>Not logged in</p>;

  return <p>Welcome, {authState.OCId}!</p>;
}
```

### Calling an API route from a component

Always pass the auth token when calling your API routes:

```tsx
'use client';

import { useOCAuth } from '@opencampus/ocid-connect-js';

export function MyComponent() {
  const auth = useOCAuth();

  const callApi = async () => {
    const idToken = auth.ocAuth?.getIdToken?.();
    const res = await fetch('/api/your-endpoint', {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    const data = await res.json();
  };

  return <button onClick={callApi}>Call API</button>;
}
```

## API Routes

**Every API route MUST be wrapped with `withAuth`.** This protects the route so only logged-in users can access it.

### Creating a new API route

Create a file at `app/api/your-endpoint/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';

export const GET = withAuth(async (req, { ocId, ethAddress }) => {
  // ocId is the logged-in user's Open Campus ID
  // ethAddress is their wallet address (may be undefined)

  return NextResponse.json({ message: 'Hello', ocId });
});

export const POST = withAuth(async (req, { ocId }) => {
  const body = await req.json();

  return NextResponse.json({ received: body, ocId });
});
```

**Do not** create API routes without `withAuth`. Every exported handler (`GET`, `POST`, `PUT`, `DELETE`) must use it.

## Adding Pages

1. Create a new file at `app/your-page/page.tsx`:
```tsx
import { TabNav } from '@/components/TabNav';

export default function YourPage() {
  return (
    <main className="min-h-screen">
      <TabNav />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">Your Page Title</h1>
        {/* Your content */}
      </div>
    </main>
  );
}
```

2. Add a tab for it in `components/TabNav.tsx` by adding to the `tabs` array:
```tsx
{
  label: 'Your Page',
  href: '/your-page',
  icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* SVG paths here */}
    </svg>
  ),
},
```

## Analytics

Track user actions from any client component:

```tsx
import { trackEvent } from '@/lib/analytics';

trackEvent('button_clicked', { button: 'signup' });
```

## Environment Variables

Already configured in `.env`. Do not change these unless instructed:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_AUTH_CLIENT_ID` | Auth client ID |
| `NEXT_PUBLIC_AUTH_SANDBOX` | Sandbox mode (`true` for development) |
| `JWKS_URL` | JWKS endpoint used to verify ID tokens (optional, defaults to staging) |
| `JWT_AUDIENCE` | Expected `aud` claim on ID tokens. Optional in sandbox mode, required when `NEXT_PUBLIC_AUTH_SANDBOX=false` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID (optional) |

## Before Finishing

Run `npm run build` to check for errors. Fix any errors before considering the task done.
