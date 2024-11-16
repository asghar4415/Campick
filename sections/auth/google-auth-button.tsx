// Add 'use client' directive to ensure this component is only rendered on the client-side.
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

export default function GoogleSignInButton() {
  const [callbackUrl, setCallbackUrl] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get callbackUrl from the search params when the component is mounted (client-side).
    const url = searchParams.get('callbackUrl');
    setCallbackUrl(url);
  }, [searchParams]);

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={() =>
        signIn('google', { callbackUrl: callbackUrl ?? '/dashboard' })
      }
    >
      <Icons.google className="mr-2 h-4 w-4" />
      Continue with Google
    </Button>
  );
}
