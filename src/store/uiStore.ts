import { create } from 'zustand';
import type { FilterType } from '../types';

interface UIState {
  sidebarOpen: boolean;
  selectedListId: string | null;
  filter: FilterType;
  settingsOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSelectedListId: (id: string | null) => void;
  setFilter: (filter: FilterType) => void;
  setSettingsOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  selectedListId: null,
  filter: 'all',
  settingsOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSelectedListId: (id) => set({ selectedListId: id, filter: id ? 'all' : 'all' }),
  setFilter: (filter) => set({ filter, selectedListId: null }),
  setSettingsOpen: (open) => set({ settingsOpen: open }),
}));
