import { Metadata } from 'next';
import { NavigationMenuDemo } from '@/components/navbar';

export const metadata: Metadata = {
  title: 'CamPick',
  description: 'Home Page'
};

export default function HomePage() {
  return (
    <div>
      <NavigationMenuDemo />
      {/* Main content starts below the navbar with some space */}
      <div className="container mx-auto mt-20 px-4 py-8">
        {/* Add your hero and other components here */}
        <h1 className="text-4xl font-bold">Welcome to CamPick</h1>
        <p className="mt-4 text-lg">Capture the moments that matter most.</p>
      </div>
    </div>
  );
}
