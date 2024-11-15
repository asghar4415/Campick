'use client';

import { Button } from '@/components/ui/button';
import { Bell, CircleUser, X, Menu, ShoppingCart } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLogoBlack from '@/public/black logo.png';
import Image from 'next/image';
import AdminSearch from '@/components/admin-search';

interface NavigationMenuDemoProps {
  isLoggedIn: boolean;
}

export const NavigationMenuDemo = ({ isLoggedIn }: NavigationMenuDemoProps) => {
  const navigate = useRouter();
  const [isOpen, setOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setScrolling(true);
    } else {
      setScrolling(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const userLoggingout = () => {
    localStorage.removeItem('token');
    navigate.push('/');
    window.location.reload();
  };

  return (
    <header
      className={`fixed left-0 top-0 z-40 w-full bg-background transition-shadow duration-300 ${
        scrolling ? 'shadow-md' : 'shadow-none'
      }`}
    >
      <div className="container relative mx-auto flex min-h-20 flex-row items-center gap-4 lg:grid lg:grid-cols-3">
        {/* Left Menu for large screens */}
        <div className="hidden flex-row items-center justify-start gap-4 lg:flex">
          <div className="w-full flex-grow border lg:w-auto lg:flex-1">
            <AdminSearch />
          </div>
        </div>

        {/* Center Logo (Single logo for all screens) */}
        <div
          className="flex w-full justify-center hover:cursor-pointer lg:w-auto"
          onClick={() => navigate.push('/')}
        >
          <Image
            src={MainLogoBlack}
            alt="CamPick Logo"
            width={140}
            height={70}
          />
        </div>

        {/* Right Section for Large Screens */}
        <div className="hidden w-full justify-end gap-4 lg:flex">
          {/* Add to Cart Button */}
          <Button className="border-none" variant="ghost" size="sm">
            <ShoppingCart className="h-5 w-5" />
          </Button>

          {isLoggedIn ? (
            <>
              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                  >
                    <CircleUser className="h-5 w-5" />
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      userLoggingout();
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications */}
              <Button variant="secondary" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Toggle notifications</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => navigate.push('/signin')}
              >
                Sign in
              </Button>
              <Button className="gap-3">Sign up</Button>
            </>
          )}
        </div>

        <div className="right flex w-auto items-center justify-end lg:hidden">
          <Button className="border-none" variant="ghost" size="sm">
            <ShoppingCart className="h-5 w-5" />
          </Button>

          <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {isOpen && (
          <div className="absolute right-0 top-20 flex w-full flex-col gap-5 bg-background px-8 py-3 shadow-lg lg:hidden">
            {isLoggedIn ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-full"
                    >
                      <CircleUser className="h-5 w-5" />
                      <span className="sr-only">Toggle user menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => {
                        userLoggingout();
                      }}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Toggle notifications</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate.push('/signin')}
                >
                  Sign in
                </Button>
                <Button className="gap-3">Sign up</Button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
