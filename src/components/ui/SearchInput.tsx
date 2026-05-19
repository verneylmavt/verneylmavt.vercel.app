"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  prompt?: string;        // default "> search"
  label?: string;         // sr-only label
  containerClassName?: string;
};

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    {
      prompt = "> search",
      label = "Search",
      placeholder = "type to filter...",
      className,
      containerClassName,
      id,
      ...rest
    },
    ref,
  ) {
    const inputId = id ?? "search-input";
    return (
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2",
          "border border-[rgb(var(--rule)/0.18)] rounded-[2px]",
          "bg-[rgb(var(--surface)/0.4)]",
          "transition-colors duration-[var(--dur-base)] ease-[var(--ease-precise)]",
          "focus-within:border-[rgb(var(--accent)/0.55)]",
          containerClassName,
        )}
      >
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>
        <span
          aria-hidden="true"
          className="text-[0.75rem] tracking-wider uppercase text-muted"
        >
          {prompt}
        </span>
        <input
          ref={ref}
          id={inputId}
          type="search"
          placeholder={placeholder}
          className={cn(
            "w-full bg-transparent text-[0.875rem] text-foreground placeholder:text-muted-soft",
            "outline-none border-0",
            className,
          )}
          {...rest}
        />
      </div>
    );
  },
);
