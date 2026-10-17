import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type ThemePreference = "default" | "light" | "dark";

interface ThemeToggleProps {
  isDark: boolean;
  onThemeChange: (theme: ThemePreference) => void;
  className?: string;
}

export function ThemeToggle({ isDark, onThemeChange, className }: ThemeToggleProps) {
  const toggleTheme = () => onThemeChange(isDark ? "light" : "dark");

  return (
    <div
      className={cn(
        "flex h-7 items-center rounded-full border border-border bg-background p-0.5 shadow-sm transition-colors duration-300",
        className,
      )}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
            aria-pressed={isDark}
            onClick={toggleTheme}
            className="relative h-6 w-12 rounded-full p-0 hover:bg-transparent"
          >
            <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-1.5 text-muted-foreground">
              <Sun className="size-3" strokeWidth={1.5} />
              <Moon className="size-3" strokeWidth={1.5} />
            </span>
            <span
              className={cn(
                "pointer-events-none absolute left-0.5 top-0.5 flex size-5 items-center justify-center rounded-full bg-foreground text-background shadow-sm transition-transform duration-300 motion-reduce:transition-none",
                isDark && "translate-x-6",
              )}
            >
              {isDark ? (
                <Moon className="size-3" strokeWidth={1.5} />
              ) : (
                <Sun className="size-3" strokeWidth={1.5} />
              )}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Switch to {isDark ? "light" : "dark"} mode</TooltipContent>
      </Tooltip>
    </div>
  );
}
