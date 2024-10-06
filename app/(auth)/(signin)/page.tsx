import { SignInViewPage } from '@/sections/auth/view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CamPick',
  description: 'Sign In.'
};

export default function Page() {
  return <SignInViewPage />;
}
