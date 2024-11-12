import create from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      userId: null,
      setUserId: (id) => set({ userId: id })
    }),
    {
      name: 'user-storage' // name of the item in storage
    }
  )
);

export default useStore;
