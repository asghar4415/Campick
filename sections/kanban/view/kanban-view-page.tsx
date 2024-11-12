import { Breadcrumbs } from '@/components/breadcrumbs';
import { AllShops } from '../kanban-board';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Shops', link: '/dashboard/shops' }
];

export default function KanbanViewPage() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={`Shops`}
            description="Manage your shops and their menu items."
          />
        </div>
        <br />
        <AllShops />
      </div>
    </PageContainer>
  );
}
