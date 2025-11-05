import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface DialogStore {
  ids: Record<string, { callback?: (...args: any[]) => void; data?: any }>;
  open: (id: string, data?: any, callback?: (...args: any[]) => void) => void;
  close: (id: string, ...args: any[]) => void;
}

const useDialogStore = create<DialogStore>()(
  devtools(
    (set) => ({
      ids: {},
      open: (id: string, data?: any, callback?: (...args: any[]) => void) =>
        set((state) => ({
          ids: {
            ...state.ids,
            [id]: { callback: callback || (() => {}), data },
          },
        })),
      close: (id: string, ...args: any[]) =>
        set((state) => {
          if (!state.ids[id]) return { ids: state.ids };
          const { callback } = state.ids[id];
          const { [id]: _, ...rest } = state.ids;
          setTimeout(() => {
            callback?.(...args);
          }, 0);
          return { ids: rest };
        }),
    }),
    { name: "dialog-store" }
  )
);

export default useDialogStore;
