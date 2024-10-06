'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation'; // Correct import
import GoogleSignInButton from './google-auth-button';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }), // Add password validation
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserSignupForm() {
  const router = useRouter(); // Initialize router
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: UserFormValue) => {
    try {
      // console.log('Login data:', data);
      const response = await axios.post(`${API_URL}/api/signin`, {
        email: data.email,
        password: data.password,
      });
      console.log('Login response:', response.data);
      console.log(response.data.message);

      if (response.data.message == 'Welcome back!') {
        router.push('/dashboard'); // Navigate to the dashboard
      } else if (response.status === 401) {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      // console.error('Login error:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const gotologinpage = () => {
    router.push('/'); // Navigate to the signup page
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    type="fullname"
                    placeholder="Enter your Fullname..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="ml-auto w-full" type="submit">
            Sign Up
          </Button>
        </form>
      </Form>
        
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">
          Already Signed up ?,{' '}
          <a onClick={gotologinpage} className="text-primary" style={{cursor: 'pointer'}}>
            Sign in
          </a>
        </span>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <GoogleSignInButton />
    </>
  );
}
