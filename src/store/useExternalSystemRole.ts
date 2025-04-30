import axios from "axios";
import { create } from "zustand";

export interface ExternalSystemRole {
  id: number;
  name: string;
}

interface ExternalSystemRoleStore {
  roles: ExternalSystemRole[];
  fetchExternalSystemRoles: (externalSystemId: number) => Promise<void>;
}

export const useFetchExternalSystemRoles = create<ExternalSystemRoleStore>(
  (set) => ({
    roles: [],
    fetchExternalSystemRoles: async (externalSystemId: number) => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/external-systems-roles/${externalSystemId}`
        );
        set({ roles: response.data.roles });
      } catch (error) {
        console.error("Error fetching work areas:", error);
      }
    },
  })
);
