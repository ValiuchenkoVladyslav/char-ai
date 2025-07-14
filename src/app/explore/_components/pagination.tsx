import { ChevronRight, ChevronsRight } from "lucide-react";
import Link from "next/link";

interface Props {
  page: number;
  maxPage: number;
  query?: string | string[];
}

const PAGINATION_ITEMS = 4;

const linkClasses =
  "bg-bg-alt rounded-lg flex items-center justify-center w-12 h-12 aria-[disabled=true]:opacity-40 aria-[disabled=true]:pointer-events-none aria-[current=page]:bg-active";

export function Pagination({ page, maxPage, query }: Props) {
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
