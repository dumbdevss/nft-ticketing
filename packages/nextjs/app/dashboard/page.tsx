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

// TODOs 1: define a WalletAccount type

export default function DashboardPage() {
  // TODOs 2: use useWallet hook to get the user wallet conencted and the wallet address
  const { account } = { address: '@0x0' } // WalletAccount used here

  // TODO 3: using useView hook get the user tickets using get_tickets_by_user view function
  const { data, error, isLoading, refetch } = {
    data: [[]],
    error: "",
    isLoading: false,
    refetch: () => {},
  }


  // TODOs 4: get the reformated data of the user tickts 
  const enrichedTickets: EnrichedTicket[] = data?.[0]?.map((ticket: Ticket) => {
    // Retrieve events from localStorage

    // Find the event matching the ticket's event_id
    
    // dummy data to remove
    let event = {
      name: "NFT conference",
      date: "",
      location: "",
      image: ""
    }

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