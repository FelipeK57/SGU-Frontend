import { create } from "zustand";

interface WorkArea {
  id: number;
  name: string;
}

export const useFetchWorkAreas = create<WorkArea>((set) => ({
  id: 1,
  name: "Hola",
}));
