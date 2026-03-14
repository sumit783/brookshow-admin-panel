import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  hideOnMobile?: boolean;
}

interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  getRowId?: (row: T) => string | number;
  pagination?: PaginationConfig;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  className,
  getRowId,
  pagination,
}: DataTableProps<T>) {
  const defaultGetRowId = (row: T) => row.id || row._id || Math.random().toString();
  const idGetter = getRowId || defaultGetRowId;

  const renderPaginationItems = () => {
    if (!pagination) return null;
    const { currentPage, totalPages, onPageChange } = pagination;
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          onClick={() => onPageChange(1)}
          isActive={currentPage === 1}
          className="cursor-pointer"
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (currentPage > 3) {
      items.push(<PaginationEllipsis key="left-ellipsis" />);
    }

    // Show pages around current
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => onPageChange(i)}
            isActive={currentPage === i}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (currentPage < totalPages - 2) {
      items.push(<PaginationEllipsis key="right-ellipsis" />);
    }

    // Always show last page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => onPageChange(totalPages)}
            isActive={currentPage === totalPages}
            className="cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="space-y-4">
      <div className={cn("glass-modern rounded-xl overflow-hidden", className)}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border/50 hover:bg-transparent">
                {columns.map((column, index) => (
                  <TableHead
                    key={index}
                    className={cn(
                      "text-muted-foreground font-medium py-3 sm:py-4 text-xs sm:text-sm whitespace-nowrap",
                      column.hideOnMobile && "hidden md:table-cell",
                      column.className
                    )}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow
                  key={idGetter(row) || rowIndex}
                  className="border-b border-border/30 hover:bg-secondary/50 transition-colors"
                >
                  {columns.map((column, index) => (
                    <TableCell
                      key={index}
                      className={cn(
                        "py-3 sm:py-4 text-sm",
                        column.hideOnMobile && "hidden md:table-cell",
                        column.className
                      )}
                    >
                      {typeof column.accessor === "function"
                        ? column.accessor(row)
                        : (row[column.accessor as keyof T] as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => pagination.onPageChange(Math.max(1, pagination.currentPage - 1))}
                className={cn(
                  "cursor-pointer",
                  pagination.currentPage === 1 && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext
                onClick={() => pagination.onPageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
                className={cn(
                  "cursor-pointer",
                  pagination.currentPage === pagination.totalPages && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
