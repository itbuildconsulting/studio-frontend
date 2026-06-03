import React, { Key, useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AuthSelectProps {
  label: string;
  options: any;
  value: any;
  required?: boolean;
  noRender?: boolean;
  disabled?: boolean;
  edit?: boolean;
  changeValue: (novoValor: any) => void;
  showColorIcon?: boolean;
}

const AuthSelect = ({
  label,
  options,
  value,
  required,
  noRender,
  disabled,
  edit,
  changeValue,
  showColorIcon = false,
}: AuthSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const safeOptions = Array.isArray(options) ? options : [];

  const handleChange = (newValue: string) => {
    changeValue?.(newValue);
    setIsOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (noRender) return null;

  const selectedLabel = safeOptions.find((o: any) => o.value === value)?.label;

  return (
    <div className="flex flex-col mb-4">
      <Label>{label}</Label>

      {edit === true && value === null ? (
        <div className="flex h-10 items-center border border-input rounded-md px-3 bg-background">
          <div className="load load-input" />
        </div>
      ) : (
        <div className="relative" ref={ref}>
          {/* Trigger */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={cn(
              "flex h-10 w-full items-center justify-between rounded-full border border-input bg-background px-3 py-2 text-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              !selectedLabel && "text-muted-foreground"
            )}
          >
            <span className="flex items-center gap-2 truncate">
              {showColorIcon &&
                safeOptions
                  .find((o: any) => o.value === value)
                  ?.colors?.split(" ")
                  .map((c: string, k: Key) => (
                    <span
                      key={k}
                      className="h-4 w-4 rounded-full border border-border shrink-0"
                      style={{ backgroundColor: c }}
                    />
                  ))}
              {selectedLabel ?? "Selecione..."}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn("text-muted-foreground shrink-0 transition-transform duration-200", isOpen && "rotate-180")}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover shadow-md overflow-auto max-h-60">
              <ul className="p-1">
                {safeOptions.map((option: any) => (
                  <li
                    key={option.value}
                    onClick={() => handleChange(option.value)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer select-none rounded-md",
                      "hover:bg-accent hover:text-accent-foreground",
                      option.value === value && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    {showColorIcon &&
                      option.colors?.split(" ").map((c: string, k: Key) => (
                        <span
                          key={k}
                          className="h-4 w-4 rounded-full border border-border shrink-0"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthSelect;
