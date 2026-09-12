'use client';

import clsx from 'clsx';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { generatePagination } from '@/lib/utils';

interface PaginationNumberProps {
  page: number | string;
  href: string;
  isActive: boolean;
  position?: 'first' | 'last' | 'middle' | 'single';
}

function PaginationNumber({
  page,
  href,
  isActive,
  position = 'first',
}: PaginationNumberProps) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center border text-sm',
    {
      'rounded-l-md': position === 'first' || position === 'single',
      'rounded-r-md': position === 'last' || position === 'single',
      'z-10 border-blue-600 bg-blue-600 text-white': isActive,
      'hover:bg-muted': !isActive && position !== 'middle',
      'text-muted-foreground': position === 'middle',
    }
  );
  return isActive || position === 'middle' ? (
    <div className={className}>{page}</div>
  ) : (
    <Link className={className} href={href}>
      {page}
    </Link>
  );
}

interface PaginationArrowProps {
  href: string;
  direction: 'left' | 'right';
  isDisabled: boolean;
}

function PaginationArrow({
  href,
  direction,
  isDisabled = false,
}: PaginationArrowProps) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center rounded-md border',
    {
      'pointer-events-none text-muted-foreground': isDisabled,
      'hover:bg-muted': !isDisabled,
      'mr-2 md:mr-4': direction === 'left',
      'ml-2 md:ml-4': direction === 'right',
    }
  );
  const icon =
    direction === 'left' ? (
      <ArrowLeft className="w-4" />
    ) : (
      <ArrowRight className="w-4" />
    );
  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  );
}

function Pagination({ totalPages }: { totalPages: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPage = Number(searchParams.get('page')) || 1;
  const allPages = generatePagination(currentPage, totalPages);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="mt-4 mb-2 flex justify-between">
      <p className="hidden text-foreground text-xs uppercase md:block">
        Current Page:
        <span className="font-bold"> {currentPage}</span>
      </p>
      <div className="inline-flex">
        <PaginationArrow
          direction="left"
          href={createPageURL(currentPage - 1)}
          isDisabled={currentPage <= 1}
        />
        <div className="-space-x-px flex">
          {allPages.map((page: number | string, index: number) => {
            let position: 'first' | 'last' | 'middle' | 'single' | undefined;
            if (index === 0) position = 'first';
            if (index === allPages.length - 1) position = 'last';
            if (allPages.length === 1) position = 'single';
            if (page === '...') position = 'middle';
            return (
              <PaginationNumber
                href={createPageURL(page)}
                isActive={currentPage === page}
                key={page}
                page={page}
                position={position}
              />
            );
          })}
        </div>
        <PaginationArrow
          direction="right"
          href={createPageURL(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
        />
      </div>
    </div>
  );
}

export default Pagination;
