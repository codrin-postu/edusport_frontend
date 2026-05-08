"use client";

import { cn } from "@/utils/cn";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildUrl } from "./_helpers";

interface PaginationProps {
  currentPage: number;
  pageCount: number;
  category: string;
  search: string;
}

export default function Pagination({
  currentPage,
  pageCount,
  category,
  search,
}: PaginationProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  if (pageCount <= 1) return null;

  function navigate(url: string) {
    startTransition(() => router.push(url, { scroll: false }));
  }

  return (
    <div className="flex items-center justify-center gap-1 pt-12">
      <button
        onClick={() =>
          navigate(buildUrl({ page: currentPage - 1, category, search }))
        }
        disabled={currentPage === 1}
        className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => navigate(buildUrl({ page: p, category, search }))}
          className={cn(
            "w-9 h-9 rounded-lg text-sm font-medium transition-colors flex items-center justify-center",
            p === currentPage
              ? "bg-edusport-blue text-white"
              : "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
          )}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() =>
          navigate(buildUrl({ page: currentPage + 1, category, search }))
        }
        disabled={currentPage === pageCount}
        className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
