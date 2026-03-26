import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getContacts, Contact } from "@/api/contacts";
import { User, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const MessageCell = ({ message }: { message: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const words = message.split(" ");
  const wordLimit = 20;
  const isLong = words.length > wordLimit;

  return (
    <div className="max-w-[400px]">
      <div className="whitespace-pre-wrap text-xs sm:text-sm">
        {isLong && !isExpanded 
          ? words.slice(0, wordLimit).join(" ") + "..." 
          : message}
      </div>
      {isLong && (
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 text-primary hover:bg-transparent hover:text-primary/80 mt-1 flex items-center gap-1 font-medium text-xs"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              Read less <ChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              Read more <ChevronDown className="w-3 h-3" />
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default function Contacts() {
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: getContacts,
  });

  const columns = [
    {
      header: "Sender",
      accessor: (row: Contact) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground">
            <User className="w-4 h-4" />
          </div>
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Subject",
      accessor: "subject" as const,
      className: "max-w-[200px] truncate",
    },
    {
      header: "Message",
      accessor: (row: Contact) => <MessageCell message={row.message} />,
    },
    {
      header: "Date",
      accessor: (row: Contact) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A"}</span>
        </div>
      ),
      hideOnMobile: true,
    },
  ];

  return (
    <>
      <PageHeader
        title="Contact Messages"
        description="View messages sent from the website's contact page."
      />

      <div className="glass-modern rounded-xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            All Messages ({contacts.length})
          </h2>
        </div>
        {isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={contacts}
          />
        )}
      </div>
    </>
  );
}
