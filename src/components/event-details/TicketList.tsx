
import { TicketType } from "@/api/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface TicketListProps {
    tickets: TicketType[];
}

export function TicketList({ tickets }: TicketListProps) {
    return (
        <Card className="glass-modern border-0">
            <CardHeader>
                <CardTitle>Ticket Types</CardTitle>
            </CardHeader>
            <CardContent>
                {tickets.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No ticket types defined.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tickets.map((ticket) => (
                            <div key={ticket._id} className="p-4 rounded-xl bg-secondary/30 border border-border/50 space-y-3">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-lg">{ticket.title}</h4>
                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                        ₹{ticket.price.toLocaleString()}
                                    </Badge>
                                </div>

                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Quantity</span>
                                        <span className="font-medium">{ticket.quantity}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Sold</span>
                                        <span className="font-medium">{ticket.sold}</span>
                                    </div>
                                </div>

                                <div className="h-1.5 bg-secondary rounded-full overflow-hidden w-full mt-2">
                                    <div
                                        className="h-full bg-primary rounded-full"
                                        style={{ width: `${(ticket.sold / ticket.quantity) * 100}%` }}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground pt-1">
                                    Sale Ends: {format(new Date(ticket.salesEnd), "MMM d, yyyy")}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
