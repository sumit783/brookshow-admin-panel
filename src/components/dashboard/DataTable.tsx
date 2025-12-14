import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  className,
}: DataTableProps<T>) {
  return (
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
            {data.map((row) => (
              <TableRow
                key={row.id}
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
                      : (row[column.accessor] as React.ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
