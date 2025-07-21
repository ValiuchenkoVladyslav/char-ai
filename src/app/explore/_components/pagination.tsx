"use client";

import { ChevronRight, ChevronsRight } from "lucide-react";
import Link from "next/link";
import { use } from "react";

const PAGINATION_ITEMS = 4;

const linkClasses =
  "bg-bg-alt rounded-lg flex items-center justify-center w-12 h-12 aria-[disabled=true]:opacity-40 aria-[disabled=true]:pointer-events-none aria-[current=page]:bg-active border-1 aria-[current=page]:border-0";

namespace Pagination {
  export interface Props {
    page: number;
    query?: string | string[];
    itemsCount: Promise<number>;
    itemsPerPage: number;
  }
}

export function Pagination({
  page,
  query,
  itemsCount,
  itemsPerPage,
}: Pagination.Props) {
  const maxPage = Math.max(1, Math.ceil(use(itemsCount) / itemsPerPage));

  const paginationOffset = Math.max(
    1,
    Math.min(page - 1, maxPage - (PAGINATION_ITEMS - 1)),
  );

  function href(page: number) {
    return {
      query: {
        page: String(page),
        ...(query ? { q: query } : {}),
      },
    };
  }

  return (
    <nav className="flex py-2 gap-2 justify-center font-bold">
      <Link href={href(1)} aria-disabled={page === 1} className={linkClasses}>
        <ChevronsRight className="rotate-180" />
      </Link>
      <Link
        href={href(page - 1)}
        aria-disabled={page === 1}
        className={linkClasses}
      >
        <ChevronRight className="rotate-180" />
      </Link>

      {Array.from({ length: Math.min(maxPage, PAGINATION_ITEMS) }).map(
        (_, i) => {
          const _page = paginationOffset + i;

          return (
            <Link
              key={`paglink-${_page}${query}`}
              href={href(_page)}
              aria-current={_page === page && "page"}
              className={linkClasses}
            >
              {_page}
            </Link>
          );
        },
      )}

      <Link
        href={href(page + 1)}
        aria-disabled={page === maxPage}
        className={linkClasses}
      >
        <ChevronRight />
      </Link>
      <Link
        href={href(maxPage)}
        aria-disabled={page === maxPage}
        className={linkClasses}
      >
        <ChevronsRight />
      </Link>
    </nav>
  );
}
