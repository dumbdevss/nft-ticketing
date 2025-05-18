"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";
import { Button } from "~~/components/ui/button";
import { Badge } from "~~/components/ui/badge";
import { QRCodeSVG } from "qrcode.react";
import Navbar from "~~/components/navbar";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import useSubmitTransaction from '~~/hooks/scaffold-move/useSubmitTransaction';
import { ArrowLeft, Calendar, MapPin, ArrowRightLeft, Lock, ExternalLink } from "lucide-react";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

// Define ticket type, aligned with DashboardPage
interface Ticket {
  ticket_id: string;
  event_id: string;
  is_soulbound: boolean;
  is_used: boolean;
  metadata_hash: string;
  owner: string;
  purchase_time: string;
  usage_time: string;
  name: string;
  date: string;
  location: string;
  description?: string;
  image?: string;
  time?: string;
  address?: string;
}

// Define params type for useParams
interface Params {
  id: string;
}

// TODO 7: define the graphql to get user nfts from the indexer
const GET_USER_NFTS_QUERY = gql`
  
`;

export default function TicketPage() {
  const params = useParams();
  const { id } = params;

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [onChainNftData, setOnChainNftData] = useState<any[]>([]);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { account } = useWallet();
  const { submitTransaction } = useSubmitTransaction("ticketing");

  // Fetch tickets using GraphQL
  const { data, loading, error: queryError } = useQuery(GET_USER_NFTS_QUERY, {
    variables: { ownerAddress: account?.address || "" },
    skip: !account?.address, // Skip query if no wallet address
  });
  console.log(data);

  
  useEffect(() => {
    setIsLoading(true);
    if (queryError) {
      setError("Failed to fetch tickets from blockchain");
      console.error("GraphQL query error:", queryError);
      return;
    }
    try {
      if (data?.current_token_ownerships_v2) {
        // Map GraphQL data to Ticket interface
        const nft_data: any = data.current_token_ownerships_v2.map((nft: any) => {
          return {
            token_address: nft.token_data_id,
            event_image: nft.current_token_data.token_uri,
          };
        });

        setOnChainNftData(nft_data);
      }

      const storedTickets = localStorage.getItem(`tickets-${account?.address}`);
      const parsedTickets: Ticket[] = storedTickets ? JSON.parse(storedTickets) : [];
      setTickets(parsedTickets);

      const foundTicket = parsedTickets.find((ticket) => ticket.ticket_id === id);
      if (foundTicket) {
        setTicket(foundTicket);
      } else {
        setError("Ticket not found");
      }
    } catch (err) {
      setError("Failed to load tickets");
      console.error("Error parsing tickets from localStorage:", err);
    } finally {
      setIsLoading(false);
    }
  }, [id, data, queryError, account]);

  const handleTransfer = async (ticket: Ticket, recipientAddress: string) => {
    // TODO: Implement blockchain transfer logic (e.g., call Aptos API)
  let nft = onChainNftData.find((nft) => nft.event_image === ticket.image);
    if (!nft) {
      console.error("NFT not found in onChainNftData");
      return;
    }

    if (!recipientAddress) {
      console.error("Recipient address is empty");
      return;
    }

    // Check if the recipient address starts with "0x"
    if (recipientAddress.startsWith("0x")) {
      recipientAddress = recipientAddress.slice(2);
    }

    // Call the transfer function from the smart contract
    // Assuming the transfer function takes recipient address and token address as arguments

    await submitTransaction("transfer_ticket",  [
      `0x${recipientAddress}`,
      onChainNftData[0].token_address,
    ])
    console.log(`Transferring ticket ${ticket?.ticket_id} to ${recipientAddress}`);
    setRecipientAddress("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-12">
        <Navbar />
        <div className="container mx-auto px-4 py-8">Loading...</div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-12">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <p className="text-red-600">{error || "Ticket not found"}</p>
        </div>
      </div>
    );
  }

  const qrValue = {
    eventId: ticket?.event_id,
    userAddress: account?.address,
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-12">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="relative h-48 sm:h-64 md:h-80">
                <img
                  src={ticket.image || "/placeholder.svg"}
                  alt={ticket.name || "Ticket Image"}
                  className="w-full h-full"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{ticket.name || "Unknown Event"}</CardTitle>
                    <CardDescription>{ticket.description || "No description available"}</CardDescription>
                  </div>
                  <Badge variant={ticket.is_soulbound ? "secondary" : "default"} className="ml-2">
                    {ticket.is_soulbound ? (
                      <Lock className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowRightLeft className="h-3 w-3 mr-1" />
                    )}
                    {ticket.is_soulbound ? "Soulbound" : "Transferrable"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Date & Time</p>
                        <p className="text-sm text-muted-foreground">{ticket.date || "Unknown"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{ticket.location || "Unknown"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="font-medium mb-2">Ticket Details</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-x-2">
                      <span className="text-sm text-muted-foreground">Token ID:</span>
                      <span className="text-sm font-medium">{ticket.ticket_id}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground">Owner</span>
                      <span className="text-sm font-medium">{`${ticket.owner?.slice(0, 4)}...${ticket.owner?.slice(62)}`}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {!ticket.is_soulbound && (
              <Card>
                <CardHeader>
                  <CardTitle>Transfer Ticket</CardTitle>
                  <CardDescription>Send this ticket to another wallet address</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter recipient wallet address"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <Button
                      disabled={!recipientAddress}
                      onClick={() => handleTransfer(ticket, recipientAddress)}
                      className="bg-gradient-to-r from-blue-500 to-blue-700"
                    >
                      Transfer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>QR Code</CardTitle>
                <CardDescription>Scan to validate ticket</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-lg mb-4">
                   <QRCodeSVG
                          value={typeof qrValue === 'string' ? qrValue : `http://localhost:3000/validate/${qrValue.userAddress}_${qrValue.eventId}`}
                          size={250}
                          level={"H"}
                          includeMargin={true}
                        />
                </div>
                <p className="text-sm text-center text-muted-foreground mb-4">
                  Present this QR code at the event entrance for validation
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`https://explorer.aptoslabs.com/object/${ticket.ticket_id}`} target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Blockchain
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}