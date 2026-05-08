"use client";

import { cn } from "@/utils/cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";
import { CATEGORIES, buildUrl } from "./_helpers";
import type { CategoryKey } from "./_data";

interface ToolbarProps {
  currentCategory: CategoryKey | "toate";
  currentSearch: string;
}

export default function Toolbar({
  currentCategory,
  currentSearch,
}: ToolbarProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function navigate(url: string) {
    startTransition(() => router.push(url, { scroll: false }));
  }

  const isFiltered = currentCategory !== "toate";
  const activeLabel = CATEGORIES.find((c) => c.key === currentCategory)?.label;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
      <SearchBar
        value={currentSearch}
        category={currentCategory}
        navigate={navigate}
      />
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="group flex items-center gap-2 min-w-[180px] pl-3 pr-8 py-2.5 text-sm border border-gray-200 bg-gray-50 text-gray-600 outline-none cursor-pointer transition-colors relative">
              {activeLabel}
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 transition-transform group-data-[state=open]:rotate-180" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            sideOffset={1}
            className="w-[var(--radix-dropdown-menu-trigger-width)] max-w-[calc(100vw-2rem)] min-w-0 bg-white border-gray-200 shadow-lg rounded-none p-0"
          >
            {CATEGORIES.map((cat) => (
              <DropdownMenuItem
                key={cat.key}
                onSelect={() =>
                  navigate(
                    buildUrl({
                      page: 1,
                      category: cat.key,
                      search: currentSearch,
                    }),
                  )
                }
                className={cn(
                  "rounded-none cursor-pointer px-3 py-2 text-sm transition-colors",
                  currentCategory === cat.key
                    ? "bg-edusport-blue/5 text-edusport-blue font-medium focus:bg-edusport-blue/5 focus:text-edusport-blue"
                    : "text-gray-600 focus:bg-gray-50 focus:text-gray-600",
                )}
              >
                {cat.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {isFiltered && (
          <button
            onClick={() =>
              navigate(
                buildUrl({
                  page: 1,
                  category: "toate",
                  search: currentSearch,
                }),
              )
            }
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Resetează
          </button>
        )}
      </div>
    </div>
  );
}

function SearchBar({
  value,
  category,
  navigate,
}: {
  value: string;
  category: string;
  navigate: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const search = inputRef.current?.value ?? "";
    navigate(buildUrl({ page: 1, category, search }));
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md flex">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        name="search"
        placeholder="Caută articole..."
        defaultValue={value}
        className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-edusport-blue transition-colors"
      />
    </form>
  );
}
