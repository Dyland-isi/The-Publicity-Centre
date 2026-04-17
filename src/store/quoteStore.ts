import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface QuoteItem {
  id: string;
  name: string;
  productCode?: string;
  category?: string;
  image?: string;
  quantity: number;
  colour: string;
  notes: string;
  logoFileName?: string;
}

interface QuoteStore {
  items: QuoteItem[];
  isOpen: boolean;
  addItem: (item: Pick<QuoteItem, "id" | "name" | "productCode" | "category" | "image"> & { colour?: string }) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<QuoteItem>) => void;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  clearItems: () => void;
  itemCount: () => number;
}

export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
              isOpen: true,
            };
          }
          return {
            items: [
              ...state.items,
              {
                ...item,
                quantity: 50,
                colour: item.colour ?? "",
                notes: "",
              },
            ],
            isOpen: true,
          };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        })),

      toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),
      clearItems: () => set({ items: [] }),
      itemCount: () => get().items.reduce((n, i) => n + i.quantity, 0),
    }),
    { name: "quote-storage" }
  )
);
