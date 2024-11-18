// AuthCallback.tsx

'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      // Save the token to localStorage for future authenticated requests
      localStorage.setItem('token', token);
      //parse the token
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      console.log(tokenData);
    } else {
      // Handle error or redirect to login
      router.push('/login?error=google_auth_failed');
    }
  }, [router]);

  return <div>Processing authentication...</div>;
}
