import axios from "axios";
import { create } from "zustand";

interface WorkArea {
  id: number;
  name: string;
}

interface WorkAreaStore {
  workAreas: WorkArea[];
  fetchWorkAreas: () => Promise<void>;
}

export const useFetchWorkAreas = create<WorkAreaStore>((set) => ({
  workAreas: [],

  fetchWorkAreas: async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/work-areas/`
      );
      set({ workAreas: response.data });
    } catch (error) {
      console.error("Error fetching work areas:", error);
    }
  },
}));
