'use client';

import { KanbanViewPage } from '@/sections/kanban/view';
import React, { useEffect, useState } from 'react';

export default function page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-blue-500"></div>
          <h2 className="text-2xl font-semibold">Loading</h2>
        </div>
      </div>
    );
  }
  return <KanbanViewPage />;
}
