'use client';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useTaskStore } from '@/lib/store';
import { BoardContainer, BoardColumn } from './board-column';
import NewSectionDialog from './new-section-dialog';

export function AllShops() {
  const columns = useTaskStore((state) => state.columns);
  const setColumns = useTaskStore((state) => state.setCols);
  const tasks = useTaskStore((state) => state.tasks);
  const setTasks = useTaskStore((state) => state.setTasks);

  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    useTaskStore.persist.rehydrate();
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
