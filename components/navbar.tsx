'use client';

import { Button } from '@/components/ui/button';
import { Bell, CircleUser, ShoppingCart } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MouseEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AdminSearch from '@/components/admin-search';
import MainLogo from '@/public/black logo.png';

interface UserData {
  email: string;
  id: number | null;
  role: string;
  name: string;
  image: string;
}

const UserMenu = ({
  userData,
  onLogout,
  onOrdersClick
}: {
  userData: any;
  onLogout: () => void;
  onOrdersClick: () => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline2" size="icon" className="rounded-full">
        <CircleUser className="h-5 w-5" aria-label="User Profile" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>{userData.role || 'User'}</DropdownMenuLabel>
      <DropdownMenuItem>{userData.email || 'No email'}</DropdownMenuItem>
      <DropdownMenuSeparator />
      {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
      {/* <DropdownMenuItem>Support</DropdownMenuItem> */}
      <DropdownMenuItem onClick={onOrdersClick}>Orders</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export const NavigationMenuDemo = ({
  isLoggedIn,
  loading,
  onLogout
}: {
  isLoggedIn: boolean;
  loading: boolean;
  onLogout: () => void;
}) => {
  const router = useRouter();
  const [scrolling, setScrolling] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    email: '',
    id: null,
    role: '',
    name: '',
    image: ''
  });

  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');

    if (savedCart) {
      setCartItemCount(JSON.parse(savedCart).length);
    }

    const updateCartItemCount = (event: CustomEvent) => {
      const count = event.detail;
      setCartItemCount(count > 0 ? count : 0);
    };

    window.addEventListener(
      'cartUpdated',
      updateCartItemCount as EventListener
    );

    // Cleanup listener when component unmounts
    return () => {
      window.removeEventListener(
        'cartUpdated',
        updateCartItemCount as EventListener
      );
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolling(window.scrollY > 0);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(atob(token.split('.')[1]));

      setUserData(user);
    }
  }, []);

  const userLogout = () => {
    localStorage.clear(); // Clear all local storage keys on logout
    setUserData({
      email: '',
      id: null,
      role: '',
      name: '',
      image: ''
    });
    onLogout(); // Ensure the parent updates `isLoggedIn` to `false`.
  };

  const toggleSideCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const currentState = JSON.parse(
      localStorage.getItem('cartSidebarState') || 'false'
    );
    const newState = !currentState;
    localStorage.setItem('cartSidebarState', JSON.stringify(newState));
    window.dispatchEvent(new CustomEvent('cartToggle'));
  };

  const onOrdersClick = () => {
    router.push('/orders');
  };

  return (
    <header
      className={`fixed left-0 top-0 z-40 w-full bg-background transition-shadow duration-300 ${
        scrolling ? 'shadow-md' : 'shadow-none'
      }`}
    >
      <div className="container relative mx-auto flex min-h-20 flex-row items-center justify-between gap-4 px-4 lg:px-8">
        {/* Left Section: Search (Hidden on Small Screens) */}
        <div className="hidden lg:flex lg:flex-1">
          {/* <AdminSearch /> */}
          <button
            className="btn btn-primary ml-10 font-semibold"
            onClick={() => router.push('/')}
          >
            Home
          </button>
        </div>

        {/* Middle Section: Logo */}
        <div className="flex justify-center lg:flex-1">
          <Image
            src={MainLogo}
            alt="Logo"
            width={150}
            height={80}
            priority
            className="cursor-pointer"
            onClick={() => router.push('/')}
          />
        </div>

        {/* Right Section: Icons */}
        <div className="flex items-center justify-end gap-2 lg:flex-1 lg:gap-4">
          {isLoggedIn && (
            <>
              <Button
                onClick={toggleSideCart}
                className="relative rounded-full bg-transparent p-2"
                variant="outline2"
              >
                <ShoppingCart className="h-5 w-5" aria-label="Shopping Cart" />
                {cartItemCount > 0 && (
                  <div
                    className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white md:text-sm"
                    style={{ transform: 'translate(25%, -25%)' }}
                  >
                    {cartItemCount}
                  </div>
                )}
              </Button>
              <UserMenu
                userData={userData}
                onLogout={userLogout}
                onOrdersClick={onOrdersClick}
              />
              <Button variant="outline2" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" aria-label="Notifications" />
              </Button>
            </>
          )}
          {!isLoggedIn && !loading && (
            <>
              <Button variant="outline" onClick={() => router.push('/signin')}>
                Sign in
              </Button>
              <Button onClick={() => router.push('/signup')}>Sign up</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
