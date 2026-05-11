import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NityaState {
  // Auth
  user: { uid: string; phone: string } | null;
  setUser: (u: { uid: string; phone: string } | null) => void;

  // Screen
  screen: string;
  setScreen: (s: string) => void;

  // Karma & stats
  karma: number;
  setKarma: (k: number) => void;
  addKarma: (n: number) => void;

  tapasyaDays: number;
  setTapasyaDays: (n: number) => void;

  shlokaCount: number;
  setShlokaCount: (n: number) => void;

  mantaDays: number;
  setMantaDays: (n: number) => void;

  nightPrayerDays: number;
  setNightPrayerDays: (n: number) => void;

  bhaktDays: number;
  setBhaktDays: (n: number) => void;

  tasksDone: { shlok: boolean; aarti: boolean };
  setTasksDone: (t: { shlok: boolean; aarti: boolean }) => void;

  // Favourites
  favorites: Array<{ id: number; grantha: string; chapter: string; sanskrit: string }>;
  addFavorite: (f: { id: number; grantha: string; chapter: string; sanskrit: string }) => void;
  removeFavorite: (id: number) => void;
}

export const useStore = create<NityaState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (u) => set({ user: u }),

      screen: "splash",
      setScreen: (s) => set({ screen: s }),

      karma: 0,
      setKarma: (k) => set({ karma: k }),
      addKarma: (n) => set((state) => ({ karma: state.karma + n })),

      tapasyaDays: 0,
      setTapasyaDays: (n) => set({ tapasyaDays: n }),

      shlokaCount: 0,
      setShlokaCount: (n) => set({ shlokaCount: n }),

      mantaDays: 0,
      setMantaDays: (n) => set({ mantaDays: n }),

      nightPrayerDays: 0,
      setNightPrayerDays: (n) => set({ nightPrayerDays: n }),

      bhaktDays: 0,
      setBhaktDays: (n) => set({ bhaktDays: n }),

      tasksDone: { shlok: false, aarti: false },
      setTasksDone: (t) => set({ tasksDone: t }),

      favorites: [],
      addFavorite: (f) => set((state) => ({ favorites: [...state.favorites.filter((x) => x.id !== f.id), f] })),
      removeFavorite: (id) => set((state) => ({ favorites: state.favorites.filter((x) => x.id !== id) })),
    }),
    { name: "nitya-store" }
  )
);
