// GoogleSignInButton.tsx

'use client';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function GoogleSignInButton() {
  const handleGoogleSignIn = () => {
    // Redirect to your backend's Google Auth route
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <Button
      className="w-full"
      variant="outline"
      type="button"
      onClick={handleGoogleSignIn}
    >
      <Icons.google className="mr-2 h-4 w-4" />
      Continue with Google
    </Button>
  );
}
