"use client";

import React, { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/form-field";
import { Icon } from "@/components/ui/icon";
import { CATEGORIES, buildUrl } from "./_helpers";
import type { CategoryFilter } from "./_data";

interface ToolbarProps {
  currentCategory: CategoryFilter;
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

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-12">
      <SearchBar
        value={currentSearch}
        category={currentCategory}
        navigate={navigate}
      />
      <div className="flex items-center gap-3">
        <Select
          value={currentCategory}
          onValueChange={(value) =>
            navigate(
              buildUrl({
                page: 1,
                category: value as CategoryFilter,
                search: currentSearch,
              }),
            )
          }
          options={CATEGORIES.map((c) => ({ value: c.key, label: c.label }))}
          size="compact"
          className="min-w-[180px]"
        />

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
            className="text-label link uppercase text-secondary transition-colors"
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
      <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
      <Input
        ref={inputRef}
        type="text"
        name="search"
        placeholder="Caută articole..."
        defaultValue={value}
        className="pl-12"
      />
    </form>
  );
}
