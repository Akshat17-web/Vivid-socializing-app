import { create } from 'zustand'
export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("Vivid-theme") || "night",
    setTheme: (theme) => {
        localStorage.setItem("Vivid-theme", theme);
        set({ theme });
    }
}));