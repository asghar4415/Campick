import { OverViewPageView } from '@/sections/overview/view';

export const metadata = {
  title: 'Dashboard : Shop owner'
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <OverViewPageView />;
}
