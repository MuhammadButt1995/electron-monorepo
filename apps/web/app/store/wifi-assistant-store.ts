import { create } from 'zustand';
import dayjs from 'dayjs';
import { persist, createJSONStorage } from 'zustand/middleware';

export type WiFiState = {
  status: 'LOADING' | 'RELIABLE' | 'DECENT' | 'SLOW' | 'ERROR';
  description?: string;
  data: {
    signal: number;
    radioType: string;
    channel: number;
  };
  lastUpdated: string;
};

export type WiFiAction<T extends WiFiState> = {
  updateStatus: (status: T['status']) => void;
  updateDescription: (description: T['description']) => void;
  updateData: (data: Partial<T['data']>) => void;
  updateLastUpdated: (lastUpdated: T['lastUpdated']) => void;
};

export const useWiFiStore = create<WiFiState & WiFiAction<WiFiState>>()(
  persist(
    (set) => ({
      status: 'LOADING',
      description: '',
      data: {
        signal: 0,
        radioType: '',
        channel: 0,
      },
      lastUpdated: dayjs().format('ddd, MMM D, YYYY h:mm A'),
      updateStatus: (status) => set({ status }),
      updateDescription: (description) => set({ description }),
      updateData: (data) =>
        set((state) => ({ data: { ...state.data, ...data } })),
      updateLastUpdated: (lastUpdated) => set(() => ({ lastUpdated })),
    }),
    {
      name: 'wifi-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
