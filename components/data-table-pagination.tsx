import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

export function DataTablePagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem
          className={cn(
            currentPage === 1
              ? "pointer-events-none text-muted-foreground"
              : "cursor-pointer"
          )}
        >
          <PaginationPrevious onClick={() => onPageChange(currentPage - 1)} />
        </PaginationItem>
        {Array.from({ length: totalPages }).map((_, n) => {
          const pageCount = n + 1;

          return (
            <PaginationItem key={`pagenumber-${pageCount}`}>
              <PaginationLink
                className="cursor-pointer"
                isActive={currentPage === pageCount}
                onClick={() => onPageChange(pageCount)}
              >
                {pageCount}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem
          className={cn(
            currentPage === totalPages
              ? "pointer-events-none text-muted-foreground"
              : "cursor-pointer"
          )}
        >
          <PaginationNext onClick={() => onPageChange(currentPage + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
