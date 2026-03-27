# Open Campus Mini-App Template

A minimal Next.js App Router template for Open Campus mini-apps. Designed to run embedded in the OC Hub iframe with shared authentication via cookies.

## Quick Start

1. **Clone or use as template**

   ```bash
   git clone <this-repo>
   cd oc-miniapp-template
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   ```bash
   cp .env.example .env
   ```

   The default values match the staging environment.

4. **Start development server**
   ```bash
   npm run dev
   ```
   This starts both the Next.js app and the [OC Hub Harness](https://github.com/opencampus/ochub-harness) side by side. Open [http://localhost:8080](http://localhost:8080) to see your app running inside the simulated hub.

## Project Structure

```
app/
├── layout.tsx          # Root layout with providers
├── page.tsx            # Home page
├── providers.tsx       # Auth context wrapper
└── globals.css         # Tailwind v4 styles + brand colors

components/
├── UserInfo.tsx        # Display logged-in user info
└── TrackEventButton.tsx # Sample analytics event button

lib/
├── env.ts              # Environment configuration
└── analytics.ts        # OCAnalytics wrapper
```

## Styling

Uses Tailwind CSS v4 with Open Campus brand colors:

```css
/* Available brand colors */
bg-brand-blue    /* #141beb */
bg-brand-cyan    /* #02eec4 */
text-brand-blue
text-brand-cyan
```

## Adding New Pages

Create a file at `app/your-page/page.tsx`:

```tsx
export default function YourPage() {
  return <h1>Your Page</h1>;
}
```

Visit `/your-page` to see it.

## Adding API Routes

Create `app/api/your-endpoint/route.ts`:

```tsx
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello!" });
}
```

## Authentication

Mini-apps run embedded in the OC Hub iframe. Authentication is shared via cookies on `.educhain.xyz` - no login flow needed.

### Access User Info

```tsx
"use client";
import { useOCAuth } from "@opencampus/ocid-connect-js";

export function MyComponent() {
  const auth = useOCAuth();
  const authState = auth?.authState;

  if (!authState || authState.isLoading) return <p>Loading...</p>;
  if (!authState.isAuthenticated) return <p>Not logged in</p>;

  return <p>Welcome, {authState.OCId}!</p>;
}
```

## Tracking Events

```tsx
"use client";
import { trackEvent } from "@/lib/analytics";

trackEvent("button_clicked", { button: "signup" });
```

## Environment Variables

| Variable                     | Description                        |
| ---------------------------- | ---------------------------------- |
| `NEXT_PUBLIC_AUTH_CLIENT_ID` | OCConnect client ID                |
| `NEXT_PUBLIC_AUTH_SANDBOX`   | Use sandbox mode (default: `true`) |
| `NEXT_PUBLIC_GA_ID`          | Google Analytics ID (optional)     |

## Development with Harness

The `dev` script runs the [OC Hub Harness](https://github.com/opencampus/ochub-harness) alongside Next.js. The harness simulates the OC Hub iframe environment, injecting authentication tokens so you can develop and test locally without deploying.

Harness log lines are prefixed with `@opencampus/ochub-harness:` so they're easy to distinguish from Next.js output.

### Harness Options

To customise the harness, edit the `dev` script in `package.json`:

```jsonc
"dev": "npx concurrently --raw 'npx @opencampus/ochub-harness --port 9000 --url http://localhost:3000' 'next dev -p 3000'"
```

| Flag     | Default                 | Description                 |
| -------- | ----------------------- | --------------------------- |
| `--url`  | `http://localhost:3000` | URL of your mini-app        |
| `--port` | `8080`                  | Port for the harness server |

## Scripts

| Command         | Description                         |
| --------------- | ----------------------------------- |
| `npm run dev`   | Start dev server + harness together |
| `npm run build` | Build for production                |
| `npm start`     | Start production server             |

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Open Campus OCID](https://devdocs.educhain.xyz/start-building/open-campus-id-connect-sdk)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
