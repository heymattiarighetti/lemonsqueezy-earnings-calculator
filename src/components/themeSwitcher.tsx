"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <Button
        size="icon"
        className="fixed right-10 top-10 z-50"
        aria-label="Toggle dark mode"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Sun className="stroke-text hidden h-6 w-6 w500:h-4 w500:w-4 dark:inline" />
        <Moon className="stroke-text inline h-6 w-6 w500:h-4 w500:w-4 dark:hidden" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </>
  );
}
