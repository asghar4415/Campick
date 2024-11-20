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
import axios from 'axios';
import MainLogo from '@/public/black logo.png';
import { set } from 'date-fns';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface NavigationMenuDemoProps {
  isLoggedIn: boolean;
}

const UserMenu = ({
  userData,
  onLogout
}: {
  userData: any;
  onLogout: () => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="secondary" size="icon" className="rounded-full">
        <CircleUser className="h-5 w-5" aria-label="User Profile" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>{userData.name || 'User'}</DropdownMenuLabel>
      <DropdownMenuItem>{userData.email || 'No email'}</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Settings</DropdownMenuItem>
      <DropdownMenuItem>Support</DropdownMenuItem>
      <DropdownMenuItem>Orders</DropdownMenuItem>

      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const MobileMenu = ({
  isLoggedIn,
  userData,
  onLogout,
  router,
  cartItemCount
}: {
  isLoggedIn: boolean;
  userData: any;
  onLogout: () => void;
  router: any;
  cartItemCount: number;
}) => {
  return (
    <div className="absolute right-0 top-20 w-full bg-background px-8 py-4 shadow-lg lg:hidden">
      {isLoggedIn ? (
        <div className="flex flex-col items-end gap-4">
          {/* Cart Section */}
          <button
            onClick={(e) => {
              e.preventDefault();
              const currentState = JSON.parse(
                localStorage.getItem('cartSidebarState') || 'false'
              );
              const newState = !currentState;
              localStorage.setItem(
                'cartSidebarState',
                JSON.stringify(newState)
              );
              window.dispatchEvent(new CustomEvent('cartToggle'));
            }}
            className="relative flex w-full items-center justify-center text-left"
          >
            <ShoppingCart className="mr-2 h-5 w-5" aria-label="Shopping Cart" />
            Cart
            {cartItemCount > 0 && (
              <div
                className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white md:text-sm"
                style={{ transform: 'translate(25%, -25%)' }}
              >
                {cartItemCount}
              </div>
            )}
          </button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline2"
                size="icon"
                className="w-full text-left"
              >
                <CircleUser
                  className="mr-2 h-5 w-5"
                  aria-label="User Profile"
                />
                Profile
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-full">
              <DropdownMenuLabel>{userData.name || 'User'}</DropdownMenuLabel>
              <DropdownMenuItem>
                {userData.email || 'No email'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuItem>Orders</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button
            variant="outline2"
            size="icon"
            className="flex w-full items-center text-left"
          >
            <Bell className="mr-2 h-5 w-5" aria-label="Notifications" />
            Notifications
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/signin')}
            className="w-full"
          >
            Sign in
          </Button>
          <Button onClick={() => router.push('/signup')} className="w-full">
            Sign up
          </Button>
        </div>
      )}
    </div>
  );
};

export const NavigationMenuDemo = ({ isLoggedIn }: NavigationMenuDemoProps) => {
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
    id: null,
    role: '',
    name: '',
    image: ''
  });
  const [cartItemCount, setCartItemCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolling(window.scrollY > 0);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const userLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('cartSidebarState');
    localStorage.removeItem('selectedShop');
    localStorage.removeItem('shop');
    setUserData({
      email: '',
      id: null,
      role: '',
      name: '',
      image: ''
    });
    router.push('/'); // This will handle redirection
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

  useEffect(() => {
    const updateCartItemCount = (event: any) => {
      setCartItemCount(event.detail); // The cart item count comes from event.detail
    };

    window.addEventListener('cartUpdated', updateCartItemCount);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('cartUpdated', updateCartItemCount);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem('token');

      const fetchProfile = async () => {
        console.log('Fetching user data...');
        console.log('Token:', token);
        try {
          const response = await axios.get(`${API_URL}/api/profile`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log('User data:', response.data);
          setUserData({
            email: response.data.email,
            id: response.data.id,
            role: response.data.role,
            name: response.data.user_name,
            image: response.data.image
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          router.push('/');
        }
        setLoading(false);
      };

      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="absolute bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center bg-white bg-opacity-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-blue-500"></div>
          <h2 className="text-2xl font-semibold">Loading</h2>
        </div>
      </div>
    );
  }

  return (
    <header
      className={`fixed left-0 top-0 z-40 w-full bg-background transition-shadow duration-300 ${
        scrolling ? 'shadow-md' : 'shadow-none'
      }`}
    >
      <div className="container relative mx-auto flex min-h-20 flex-row items-center gap-4 lg:grid lg:grid-cols-3">
        {/* Left Menu */}
        <div className="hidden flex-row items-center justify-start gap-4 lg:flex">
          <div className="w-full flex-grow border lg:w-auto lg:flex-1">
            <AdminSearch />
          </div>
        </div>

        {/* Center Logo */}
        <div
          className="flex w-full justify-center hover:cursor-pointer lg:w-auto"
          onClick={() => router.push('/')}
        >
          <Image src={MainLogo} alt="Logo" width={140} height={70} priority />
        </div>

        {/* Right Section */}
        <div className="hidden w-full justify-end gap-4 lg:flex">
          <button
            onClick={toggleSideCart}
            className="relative rounded-md bg-transparent p-2"
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
          </button>

          {isLoggedIn ? (
            <>
              <UserMenu userData={userData} onLogout={userLogout} />
              <Button variant="secondary" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" aria-label="Notifications" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => router.push('/signin')}>
                Sign in
              </Button>
              <Button onClick={() => router.push('/signup')}>Sign up</Button>
            </>
          )}
        </div>

        {/* Mobile Section */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setOpen(!isOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </Button>
        {isOpen && (
          <MobileMenu
            isLoggedIn={isLoggedIn}
            userData={userData}
            onLogout={userLogout}
            router={router}
            cartItemCount={cartItemCount}
          />
        )}
      </div>
    </header>
  );
};
