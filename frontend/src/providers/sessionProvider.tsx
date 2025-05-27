// frontend/src/providers/sessionProvider.tsx
'use client';

import * as React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from 'next/navigation';

// Se este provedor também lida com o NextAuth, você precisará importar e usar
// o SessionProvider do next-auth/react aqui, envolvendo o NextUIProvider.
// Ex: import { SessionProvider } from 'next-auth/react';

// Mude de 'export function' para 'export default function'
export default function NextAuthSessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    // Aqui você envolveria com o SessionProvider do NextAuth, se aplicável
    // Ex: <SessionProvider>
      <NextUIProvider navigate={router.push}>
        {children}
      </NextUIProvider>
    // Ex: </SessionProvider>
  );
}