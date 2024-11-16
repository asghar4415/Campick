'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UserNav() {
  const router = useRouter();
  const [data, setData] = useState({
    email: '',
    id: null,
    role: '',
    name: '',
    image: '' // Add image in the state for the avatar
  });
  const [isClient, setIsClient] = useState(false); // State to track if it's client-side

  useEffect(() => {
    setIsClient(true); // Set to true when mounted on the client
  }, []);

  useEffect(() => {
    if (isClient) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = token.split('.')[1]; // Extract payload from JWT
          const parsedToken = JSON.parse(atob(payload)); // Decode payload

          // Validate if the token contains all necessary fields
          if (parsedToken?.email && parsedToken?.id && parsedToken?.role) {
            setData({
              email: parsedToken.email,
              id: parsedToken.id,
              role: parsedToken.role,
              name: parsedToken.name || 'Shop Owner', // Default to 'Shop Owner' if no name
              image: parsedToken.image || '' // Default image can be added if not in token
            });
          } else {
            throw new Error('Invalid token payload');
          }
        } catch (error) {
          console.error('Error decoding the token:', error);
          router.push('/'); // Redirect on error
        }
      } else {
        console.log('No token found');
        router.push('/'); // Redirect if no token is found
      }
    }
  }, [isClient, router]); // Add isClient to the dependency array

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {data.image ? (
              <AvatarImage src={data.image} alt={data.name} />
            ) : (
              <AvatarFallback>{data.name?.[0] || 'U'}</AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{data.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {data.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            localStorage.removeItem('token');
            router.push('/');
          }}
        >
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
