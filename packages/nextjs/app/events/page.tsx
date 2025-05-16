"use client"

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '~~/components/ui/card';
import { Badge } from '~~/components/ui/badge';
import { Button } from '~~/components/ui/button';
import { RadioGroup, RadioGroupItem } from '~~/components/ui/radio-group';
import { Label } from '~~/components/ui/label';
import Image from 'next/image';
import Navbar from '~~/components/navbar';
import useSubmitTransaction from '~~/hooks/scaffold-move/useSubmitTransaction';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useToast } from '~~/hooks/use-toast';
import { QRCodeSVG } from 'qrcode.react';
import { PinataSDK } from "pinata";
import ReactDOMServer from 'react-dom/server';

// Define TypeScript interfaces
interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  ticketTypes: TicketType[];
  image: string;
  price: string;
}

interface TicketType {
  type: 'transferrable' | 'soulbound';
  price: string;
}

interface Activity {
  action: string;
  ticket: string;
  ticketType?: string;
  time: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  
  const [selectedTicketTypes, setSelectedTicketTypes] = useState<Record<string, string>>({});

  const { submitTransaction, transactionResponse, transactionInProcess } = useSubmitTransaction("ticketing");
  const { account } = useWallet();
  const {toast} = useToast();
  const pinata = new PinataSDK({
    pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT,
    pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY,
  });


  useEffect(() => {
    // Check if events exist in localStorage
    const storedEvents = localStorage.getItem('events');

    if (!storedEvents) {
      // Create dummy events if none exist
      const dummyEvents: Event[] = [
        {
          id: "1",
          name: "Web3 Conference 2025",
          date: "May 15, 2025",
          location: "San Francisco, CA",
          ticketTypes: [
        { type: "transferrable", price: "1 MOVE" },
        { type: "soulbound", price: "1 MOVE" }
          ],
          image: "https://copper-fashionable-dolphin-815.mypinata.cloud/ipfs/bafkreihagbrmpnhs3pom7h6n44j35ozxcjpfv4bnnqcqlnkmzs3jpjfrvq",
          price: "1 MOVE"
        },
        {
          id: "2",
          name: "Blockchain Summit",
          date: "June 22, 2025",
          location: "New York, NY",
          ticketTypes: [
        { type: "soulbound", price: "1 MOVE" }
          ],
          image: "https://copper-fashionable-dolphin-815.mypinata.cloud/ipfs/bafkreibg7ptr5pstg4ow4iyq2uublhichscosqnhaiepyyv6wudrgr6uxy",
          price: "1 MOVE"
        },
        {
          id: "3",
          name: "ETH Global Hackathon",
          date: "July 10, 2025",
          location: "Berlin, Germany",
          ticketTypes: [
        { type: "transferrable", price: "1 MOVE" }
          ],
          image: "https://copper-fashionable-dolphin-815.mypinata.cloud/ipfs/bafkreib6wskjwqcumwwaboyptk2awizubpj5jec7yuai45ochb2n6yt5f4",
          price: "1 MOVE"
        },
        {
          id: "4",
          name: "DeFi Conference",
          date: "August 5, 2025",
          location: "Singapore",
          ticketTypes: [
        { type: "transferrable", price: "1 MOVE" },
        { type: "soulbound", price: "1 MOVE" }
          ],
          image: "https://copper-fashionable-dolphin-815.mypinata.cloud/ipfs/bafkreigmw3cz7lj63763d35bc6656imy2vnllhxgjzwdgwimgzgg4o2k3i",
          price: "1 MOVE"
        },
        {
          id: "5",
          name: "NFT Exhibition",
          date: "September 18, 2025",
          location: "London, UK",
          ticketTypes: [
        { type: "transferrable", price: "1 MOVE" },
        { type: "soulbound", price: "1 MOVE" }
          ],
          image: "https://copper-fashionable-dolphin-815.mypinata.cloud/ipfs/bafkreiejbp6xr2wqryvbi7gl52vtwx7i44fmpn2r6pd2z53ca7dmjmydlq",
          price: "1 MOVE"
        },
      ];

      // Store events in localStorage
      localStorage.setItem('events', JSON.stringify(dummyEvents));
      setEvents(dummyEvents);
      
      // Initialize selected ticket types with default values
      const initialSelectedTypes: Record<string, string> = {};
      dummyEvents.forEach(event => {
        initialSelectedTypes[event.id] = event.ticketTypes[0].type;
      });
      setSelectedTicketTypes(initialSelectedTypes);
    } else {
      // Load events from localStorage
      const parsedEvents = JSON.parse(storedEvents) as Event[];
      setEvents(parsedEvents);
      
      // Initialize selected ticket types with default values
      const initialSelectedTypes: Record<string, string> = {};
      parsedEvents.forEach(event => {
        initialSelectedTypes[event.id] = event.ticketTypes[0].type;
      });
      setSelectedTicketTypes(initialSelectedTypes);
    }
  }, []);

  const handleTicketTypeChange = (eventId: string, ticketType: string) => {
    setSelectedTicketTypes(prev => ({
      ...prev,
      [eventId]: ticketType
    }));
  };

const generateQRAndUploadToPinataIPFS = async (data: any): Promise<string> => {
  try {
    // Create QR code SVG element
    const qrCodeSvg = (
      <QRCodeSVG
        value={typeof data === 'string' ? data : `http://localhost:3000/validate/${data.userAddress}_${data.eventId}`}
        size={250}
        level={"H"}
        includeMargin={true}
      />
    );
    
    // Convert React element to SVG string
    const svgString = ReactDOMServer.renderToStaticMarkup(qrCodeSvg);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
    const svgFile = new File([svgBlob], "qrcode.svg", { type: "image/svg+xml" });
    
    const upload = await pinata.upload.public.file(svgFile);
    let url = `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY}/ipfs/${upload.cid}`;
    return url; // Returns the IPFS CID
  } catch (error) {
    console.error('Error generating QR code and uploading to IPFS:', error);
    throw error;
  }
};

  const handleBuyTicket = async (event: Event) => {
    const selectedType = selectedTicketTypes[event.id];
    const ticketTypeInfo = event.ticketTypes.find(t => t.type === selectedType);
  
    if (!ticketTypeInfo) return;
  
    try {
      // Handle NFT minting based on selectedType
      const transactionType =
        selectedType === "transferrable"
          ? "mint_transferable_ticket"
          : "mint_soulbound_ticket";

      console.log(event);
      let qrCodeUrl = await generateQRAndUploadToPinataIPFS({
        eventId: event.id,
        userAddress: account?.address,
      });

      console.log(qrCodeUrl)
        
      await submitTransaction(transactionType, [
        parseInt(event.id),
        qrCodeUrl,
        `${event.name} ticket for user ${account?.address}`,
        `${event.image}`,
      ]);
      
      // Success toast after successful transaction
      toast({
        title: "Purchase Successful",
        description: `Successfully purchased ${selectedType} ticket for ${event.name} at ${ticketTypeInfo.price}`,
        duration: 5000,
      });
      
    } catch (error) {
      // Error toast if transaction fails
      toast({
        title: "Purchase Failed",
        description: `Failed to purchase ticket for ${event.name}. Please try again.`,
        variant: "destructive",
        duration: 5000,
      });
      console.error("Transaction error:", error);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Upcoming Events</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
          <Card key={event.id} className="overflow-hidden flex flex-col h-full">
          <div className="relative h-48 w-full flex-shrink-0">
            <img
              src={event.image}
              alt={event.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col flex-grow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{event.name}</CardTitle>
                {event.ticketTypes.length === 1 && (
                  <Badge variant={event.ticketTypes[0].type === "transferrable" ? "default" : "secondary"}>
                    {event.ticketTypes[0].type}
                  </Badge>
                )}
                {event.ticketTypes.length > 1 && (
                  <Badge variant="outline">Multiple options</Badge>
                )}
              </div>
              <CardDescription>
                <div className="flex flex-col space-y-1">
                  <span>{event.date}</span>
                  <span>{event.location}</span>
                </div>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-grow">
              {event.ticketTypes.length > 1 ? (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Select ticket type:</h4>
                  <RadioGroup 
                    value={selectedTicketTypes[event.id]} 
                    onValueChange={(value) => handleTicketTypeChange(event.id, value)}
                    className="space-y-2"
                  >
                    {event.ticketTypes.map((ticketType, index) => (
                      <div key={index} className="flex items-center justify-between space-x-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={ticketType.type} id={`${event.id}-${ticketType.type}`} />
                          <Label htmlFor={`${event.id}-${ticketType.type}`}>
                            {ticketType.type.charAt(0).toUpperCase() + ticketType.type.slice(1)}
                          </Label>
                        </div>
                        <span className="font-medium text-sm">{ticketType.price}</span>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ) : (
                <div className="font-medium text-sm">
                  Price: {event.ticketTypes[0].price}
                </div>
              )}
            </CardContent>
            
            <CardFooter className="mt-auto">
              <Button
                className="w-full"
                onClick={() => handleBuyTicket(event)}
              >
                Buy NFT Ticket
              </Button>
            </CardFooter>
          </div>
        </Card>
          ))}
        </div>
      </div>
    </div>
  );
}