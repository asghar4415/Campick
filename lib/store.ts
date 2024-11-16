import { useReducer } from 'react';
import { v4 as uuid } from 'uuid';
import { UniqueIdentifier } from '@dnd-kit/core';

export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type Column = {
  id: UniqueIdentifier;
  title: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: Status;
};

type State = {
  tasks: Task[];
  columns: Column[];
  draggedTask: string | null;
};

type Action =
  | { type: 'ADD_TASK'; title: string; description?: string }
  | { type: 'REMOVE_TASK'; id: string }
  | { type: 'ADD_COLUMN'; title: string }
  | { type: 'UPDATE_COLUMN'; id: UniqueIdentifier; newName: string }
  | { type: 'REMOVE_COLUMN'; id: UniqueIdentifier }
  | { type: 'DRAG_TASK'; id: string | null }
  | { type: 'SET_TASKS'; tasks: Task[] }
  | { type: 'SET_COLUMNS'; columns: Column[] };

const initialState: State = {
  tasks: [
    { id: 'task1', status: 'TODO', title: 'Project initiation and planning' },
    {
      id: 'task2',
      status: 'TODO',
      title: 'Gather requirements from stakeholders'
    }
  ],
  columns: [{ id: 'TODO', title: 'Todo' }],
  draggedTask: null
};

function taskReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [
          ...state.tasks,
          {
            id: uuid(),
            title: action.title,
            description: action.description,
            status: 'TODO'
          }
        ]
      };
    case 'REMOVE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.id)
      };
    case 'ADD_COLUMN':
      return {
        ...state,
        columns: [
          ...state.columns,
          { id: action.title.toUpperCase(), title: action.title }
        ]
      };
    case 'UPDATE_COLUMN':
      return {
        ...state,
        columns: state.columns.map((col) =>
          col.id === action.id ? { ...col, title: action.newName } : col
        )
      };
    case 'REMOVE_COLUMN':
      return {
        ...state,
        columns: state.columns.filter((col) => col.id !== action.id)
      };
    case 'DRAG_TASK':
      return { ...state, draggedTask: action.id };
    case 'SET_TASKS':
      return { ...state, tasks: action.tasks };
    case 'SET_COLUMNS':
      return { ...state, columns: action.columns };
    default:
      return state;
  }
}

export function useTaskStore() {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const actions = {
    addTask: (title: string, description?: string) =>
      dispatch({ type: 'ADD_TASK', title, description }),
    removeTask: (id: string) => dispatch({ type: 'REMOVE_TASK', id }),
    addColumn: (title: string) => dispatch({ type: 'ADD_COLUMN', title }),
    updateColumn: (id: UniqueIdentifier, newName: string) =>
      dispatch({ type: 'UPDATE_COLUMN', id, newName }),
    removeColumn: (id: UniqueIdentifier) =>
      dispatch({ type: 'REMOVE_COLUMN', id }),
    dragTask: (id: string | null) => dispatch({ type: 'DRAG_TASK', id }),
    setTasks: (tasks: Task[]) => dispatch({ type: 'SET_TASKS', tasks }),
    setColumns: (columns: Column[]) =>
      dispatch({ type: 'SET_COLUMNS', columns })
  };

  return { ...state, ...actions };
}
