'use client';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useTaskStore } from '@/lib/store';
import { BoardContainer, BoardColumn } from './board-column';
import NewSectionDialog from './new-section-dialog';

export function AllShops() {
  const { tasks, columns, addTask, removeTask, addColumn, updateColumn } =
    useTaskStore();

  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div>
      <BoardContainer>
        {columns?.map((col, index) => (
          <Fragment key={col.id}>
            <BoardColumn
              column={col}
              tasks={tasks.filter((task) => task.status === col.id)}
            />
            {index === columns?.length - 1 && (
              <div className="w-[300px]">
                <NewSectionDialog />
              </div>
            )}
          </Fragment>
        ))}
        {!columns.length && <NewSectionDialog />}
      </BoardContainer>
    </div>
  );
}
