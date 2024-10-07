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
import { useRouter } from 'next/navigation';
import GoogleSignInButton from './google-auth-button';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const formSchema = z.object({
  fullname: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserSignupForm() {
  const router = useRouter();
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: UserFormValue) => {
    try {
      const response = await axios.post(`${API_URL}/api/shop_signup`, {
        user_name: data.fullname,
        email: data.email,
        password: data.password
      });
      // console.log('Signup response:', response.data);

      if (response.status === 201 || response.status === 200) {
        alert('Signup successful. Please login to continue.');
        router.push('/');
      } else if (response.status === 401 || response.status === 400) {
        alert('Signup failed. Please check your credentials.');
      }
    } catch (error) {
      // console.error('Signup error:', error);
      alert('Signup failed. Please check your credentials.');
    }
  };

  const gotoLoginPage = () => {
    router.push('/');
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your full name..."
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
          Already Signed up?,{' '}
          <a
            onClick={gotoLoginPage}
            className="text-primary"
            style={{ cursor: 'pointer' }}
          >
            Sign in
          </a>
        </span>
      </div>

      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>

        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <GoogleSignInButton /> */}
    </>
  );
}
