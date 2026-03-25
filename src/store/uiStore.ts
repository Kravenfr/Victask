import { create } from 'zustand';
import type { FilterType } from '../types';

interface UIState {
  sidebarOpen: boolean;
  selectedListId: string | null;
  filter: FilterType;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSelectedListId: (id: string | null) => void;
  setFilter: (filter: FilterType) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  selectedListId: null,
  filter: 'all',
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSelectedListId: (id) => set({ selectedListId: id, filter: id ? 'all' : 'all' }),
  setFilter: (filter) => set({ filter, selectedListId: null }),
}));
