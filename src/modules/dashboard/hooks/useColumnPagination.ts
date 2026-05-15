"use client";

import { useState, useMemo, useCallback } from "react";
import type { Task } from "@/types/task";
import type { PaginatedResult } from "@/modules/dashboard/types";

const DEFAULT_PAGE_SIZE = 5;

export function useColumnPagination(
  tasks: Task[],
  pageSize: number = DEFAULT_PAGE_SIZE,
) {
  const [page, setPage] = useState(1);
  const paginatedResult: PaginatedResult<Task> = useMemo(() => {
    const totalItems = tasks.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;
    const end = start + pageSize;
    const data = tasks.slice(start, end);

    return {
      data,
      page: safePage,
      pageSize,
      totalItems,
      totalPages,
    };
  }, [tasks, page, pageSize]);

  const goToPage = useCallback((p: number) => {
    setPage(Math.max(1, p));
  }, []);

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
  }, []);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  return {
    paginatedResult,
    goToPage,
    nextPage,
    prevPage,
    resetPage,
  };
}
