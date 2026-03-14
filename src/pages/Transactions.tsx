
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Download,
  IndianRupee,
  ArrowDownLeft,
  ArrowUpRight,
  Filter
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTransactions, WalletTransaction } from "@/api/stats";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });

  if (error) {
    console.error("Failed to load transactions:", error);
  }

  const filteredTransactions = transactions.filter(txn =>
    txn._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    txn.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    txn.ownerType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to page 1 on search
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  // Calculate totals
  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0) || 0;
  const totalCredits = transactions.reduce((sum, t) => t.type === 'credit' ? sum + t.amount : sum, 0) || 0;
  const totalDebits = transactions.reduce((sum, t) => t.type === 'debit' ? sum + t.amount : sum, 0) || 0;
  const pendingAmount = transactions.reduce((sum, t) => t.status === 'pending' ? sum + t.amount : sum, 0) || 0;

  const columns = [
    {
      header: "Transaction ID",
      accessor: (row: WalletTransaction) => (
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${row.type === "credit" ? "bg-emerald-500/20" : "bg-amber-500/20"
            }`}>
            {row.type === "credit" ? (
              <ArrowDownLeft className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
            ) : (
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
            )}
          </div>
          <span className="font-medium text-foreground text-xs sm:text-sm" title={row._id}>
            {row._id.slice(-8)}
          </span>
        </div>
      ),
    },
    {
      header: "Description & Info",
      className: "min-w-[200px] sm:min-w-[400px]",
      accessor: (row: WalletTransaction) => (
        <div className="min-w-0 max-w-[300px] sm:max-w-[600px]">
          <p className="font-medium text-foreground text-xs sm:text-sm line-clamp-2 leading-relaxed" title={row.description}>
            {row.description}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full bg-secondary/50 text-muted-foreground capitalize">
              {row.ownerType}
            </span>
            <span className="text-[10px] sm:text-xs text-muted-foreground capitalize">
              {row.source}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Amount",
      accessor: (row: WalletTransaction) => (
        <span className={`font-medium text-xs sm:text-sm ${row.type === 'credit' ? 'text-emerald-400' : 'text-amber-400'}`}>
          {row.type === 'credit' ? '+' : '-'}{formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      header: "Date",
      accessor: (row: WalletTransaction) => (
        <span className="text-muted-foreground text-xs sm:text-sm">
          {new Date(row.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      ),
      hideOnMobile: true,
    },
    {
      header: "Status",
      accessor: (row: WalletTransaction) => <StatusBadge status={row.status as any} />,
    },
  ];

  return (
    <>
      <PageHeader
        title="Transactions"
        description="Track all wallet transactions and payments"
      >
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Filter className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
          <Button variant="glass" size="sm" className="flex-1 sm:flex-none">
            <Download className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </PageHeader>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-secondary/20">
              <Skeleton className="h-full w-full rounded-xl" />
            </div>
          ))
        ) : (
          <>
            <StatsCard
              title="Total Volume"
              value={formatCurrency(totalVolume)}
              subtitle="All transactions"
              icon={IndianRupee}
              variant="default"
            />
            <StatsCard
              title="Total Credits"
              value={formatCurrency(totalCredits)}
              subtitle="Incoming funds"
              icon={ArrowDownLeft}
              variant="success"
            />
            <StatsCard
              title="Total Debits"
              value={formatCurrency(totalDebits)}
              subtitle="Outgoing funds"
              icon={ArrowUpRight}
              variant="primary"
            />
            <StatsCard
              title="Pending"
              value={formatCurrency(pendingAmount)}
              subtitle="Awaiting processing"
              icon={Filter}
              variant="warning"
            />
          </>
        )}
      </div>

      {/* Transactions Table */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="h-10 w-full bg-secondary/20 rounded-md"></div>
          <div className="h-20 w-full bg-secondary/20 rounded-md"></div>
          <div className="h-20 w-full bg-secondary/20 rounded-md"></div>
          <div className="h-20 w-full bg-secondary/20 rounded-md"></div>
        </div>
      ) : (
        <DataTable 
          columns={columns} 
          data={paginatedTransactions} 
          pagination={{
            currentPage,
            totalPages,
            onPageChange: handlePageChange
          }}
        />
      )}
    </>
  );
}
