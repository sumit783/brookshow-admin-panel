
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
import { getTransactions, Transaction } from "@/api/stats";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: transactions = [], isLoading, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });

  if (error) {
    console.error("Failed to load transactions:", error);
  }

  const filteredTransactions = transactions.filter(txn =>
    txn.eventName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    txn.artistName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    txn.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate totals
  const totalAdvance = transactions.reduce((sum, t) => sum + t.advancePayment, 0) || 0;
  const totalPayment = transactions.reduce((sum, t) => sum + t.totalPayment, 0) || 0;
  const totalReceived = transactions.reduce((sum, t) => sum + t.receivedAmount, 0) || 0;
  const totalPending = transactions.reduce((sum, t) => sum + t.pendingAmount, 0) || 0;

  const columns = [
    {
      header: "Transaction ID",
      accessor: (row: Transaction) => (
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${row.type === "incoming" ? "bg-emerald-500/20" : "bg-amber-500/20"
            }`}>
            {row.type === "incoming" ? (
              <ArrowDownLeft className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
            ) : (
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
            )}
          </div>
          <span className="font-medium text-foreground text-xs sm:text-sm">{row.id}</span>
        </div>
      ),
    },
    {
      header: "Event / Artist",
      accessor: (row: Transaction) => (
        <div className="min-w-0">
          <p className="font-medium text-foreground text-xs sm:text-sm truncate">{row.eventName}</p>
          <p className="text-xs text-muted-foreground truncate">{row.artistName}</p>
        </div>
      ),
    },
    {
      header: "Advance",
      accessor: (row: Transaction) => (
        <span className="text-foreground font-medium text-xs sm:text-sm">{formatCurrency(row.advancePayment)}</span>
      ),
      hideOnMobile: true,
    },
    {
      header: "Total",
      accessor: (row: Transaction) => (
        <span className="text-foreground font-medium text-xs sm:text-sm">{formatCurrency(row.totalPayment)}</span>
      ),
    },
    {
      header: "Received",
      accessor: (row: Transaction) => (
        <span className="text-emerald-400 font-medium text-xs sm:text-sm">{formatCurrency(row.receivedAmount)}</span>
      ),
      hideOnMobile: true,
    },
    {
      header: "Pending",
      accessor: (row: Transaction) => (
        <span className={`font-medium text-xs sm:text-sm ${row.pendingAmount > 0 ? "text-amber-400" : "text-muted-foreground"}`}>
          {formatCurrency(row.pendingAmount)}
        </span>
      ),
      hideOnMobile: true,
    },
    {
      header: "Status",
      accessor: (row: Transaction) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <>
      <PageHeader
        title="Transactions"
        description="Track all payments and financial transactions"
      >
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
              title="Total Advance"
              value={formatCurrency(totalAdvance)}
              subtitle="Advance collected"
              icon={IndianRupee}
              variant="default"
            />
            <StatsCard
              title="Total Payment"
              value={formatCurrency(totalPayment)}
              subtitle="Overall value"
              icon={IndianRupee}
              variant="primary"
            />
            <StatsCard
              title="Total Received"
              value={formatCurrency(totalReceived)}
              subtitle="Amount received"
              icon={ArrowDownLeft}
              variant="success"
            />
            <StatsCard
              title="Total Pending"
              value={formatCurrency(totalPending)}
              subtitle="Outstanding"
              icon={ArrowUpRight}
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
        <DataTable columns={columns} data={filteredTransactions} />
      )}
    </>
  );
}
