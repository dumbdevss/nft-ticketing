"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/tabs";
import { TicketList } from "~~/components/ticket-list";
import Navbar from "~~/components/navbar";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useView } from "~~/hooks/scaffold-move/useView";

// Define types for ticket and event
interface Ticket {
  event_id: string;
  is_soulbound: boolean;
  is_used: boolean;
  metadata_hash: string;
  owner: string;
  purchase_time: string;
  ticket_id: string;
  usage_time: string;
}

interface EnrichedTicket extends Ticket {
  name: string;
  date: string;
  location: string;
}

interface Event {
  id: string;
  name: string;
  date: string;
  image: string;
  location: string;
}

// Define type for useView hook response
interface UseViewResponse<T> {
  data: T | undefined;
  error: unknown;
  isLoading: boolean;
  refetch: () => void;
}

// Define type for wallet account
interface WalletAccount {
  address: string;
}

export default function DashboardPage() {
  const { account } = useWallet() as { account: WalletAccount | null };

  const { data, error, isLoading, refetch } = useView({
    moduleName: "ticketing",
    functionName: "get_tickets_by_user",
    args: account?.address ? [`${account.address}`] : [],
  }) as UseViewResponse<[Ticket[]]>;

  console.log(data)

  // Process tickets to include event details from localStorage
  const enrichedTickets: EnrichedTicket[] = data?.[0]?.map((ticket: Ticket) => {
    // Retrieve events from localStorage
    const events: Event[] = JSON.parse(localStorage.getItem("events") || "[]");

    // Find the event matching the ticket's event_id
    const event: Event | undefined = events.find((e) => e.id === ticket.event_id);

    return {
      ...ticket,
      name: event?.name || "Unknown Event",
      date: event?.date || "Unknown Date",
      location: event?.location || "Unknown Location",
      image: event?.image
    };
  }) || [];

  localStorage.setItem(`tickets-${account?.address}`, JSON.stringify(enrichedTickets));

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-12">
      <Navbar />
      <div className="container mx-auto px-4 md:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{enrichedTickets.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Transferrable</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {enrichedTickets.filter((ticket) => !ticket.is_soulbound).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Soulbound</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {enrichedTickets.filter((ticket) => ticket.is_soulbound).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Your Tickets</CardTitle>
                <CardDescription>Manage your event tickets</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="transferrable">Transferrable</TabsTrigger>
                    <TabsTrigger value="soulbound">Soulbound</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all">
                    <TicketList tickets={enrichedTickets} />
                  </TabsContent>
                  <TabsContent value="transferrable">
                    <TicketList tickets={enrichedTickets.filter((ticket) => !ticket.is_soulbound)} />
                  </TabsContent>
                  <TabsContent value="soulbound">
                    <TicketList tickets={enrichedTickets.filter((ticket) => ticket.is_soulbound)} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}