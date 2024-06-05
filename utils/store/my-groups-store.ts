import { create } from "zustand";

export type Group = {
  projectName: string;
  maxGroupSize: number;
  currentGroupSize: number;
  image: string;
};

type MyGroupsStore = {
  groups: Group[];
  setGroups(groups: Group[]): void;
};

export const useMyGroupsStore = create<MyGroupsStore>((set) => ({
  groups: [],
  setGroups: (groups: Group[]) => {
    set({ groups });
  },
}));