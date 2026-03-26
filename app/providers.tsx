'use client';

import { OCConnect } from '@opencampus/ocid-connect-js';
import { injectHashTokens } from '@opencampus/ochub-utils/auth';
import { ReactNode } from 'react';
import { env } from '@/lib/env';

injectHashTokens();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <OCConnect
      opts={{
        clientId: env.NEXT_PUBLIC_AUTH_CLIENT_ID,
        storageType: 'localStorage' as const,
      }}
      sandboxMode={env.NEXT_PUBLIC_AUTH_SANDBOX}
    >
      {children}
    </OCConnect>
  );
}
