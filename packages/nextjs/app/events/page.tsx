"use client"

import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '~~/components/ui/card';
import { Badge } from '~~/components/ui/badge';
import { Button } from '~~/components/ui/button';
import { RadioGroup, RadioGroupItem } from '~~/components/ui/radio-group';
import { Label } from '~~/components/ui/label';
import Image from 'next/image';
import Navbar from '~~/components/navbar';

// Define TypeScript interfaces
interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  ticketTypes: TicketType[];
  image: string;
  tokenId: string;
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
  const [recentActivity, setRecentActivity] = useState<Activity[]>([
    { action: "Minted", ticket: "Web3 Conference", ticketType: "Transferrable", time: "2 hours ago" },
    { action: "Transferred", ticket: "ETH Meetup", time: "1 day ago" },
    { action: "Validated", ticket: "Blockchain Summit", ticketType: "Soulbound", time: "3 days ago" },
  ]);
  
  const [selectedTicketTypes, setSelectedTicketTypes] = useState<Record<string, string>>({});

  useEffect(() => {
    // Check if events exist in localStorage
    const storedEvents = localStorage.getItem('events');

    if (!storedEvents) {
      // Create dummy events if none exist
      const dummyEvents: Event[] = [
        {
          id:"1",
          name: "Web3 Conference 2025",
          date: "May 15, 2025",
          location: "San Francisco, CA",
          ticketTypes: [
            { type: "transferrable", price: "1 MOVE" },
            { type: "soulbound", price: "1 MOVE" }
          ],
          image: "https://copper-fashionable-dolphin-815.mypinata.cloud/ipfs/bafkreihagbrmpnhs3pom7h6n44j35ozxcjpfv4bnnqcqlnkmzs3jpjfrvq",
          tokenId: "1234",
          price: "1 MOVE"
        },
        {
          id:"2",
          name: "Blockchain Summit",
          date: "June 22, 2025",
          location: "New York, NY",
          ticketTypes: [
            { type: "soulbound", price: "1 MOVE" }
          ],
          image: "https://copper-fashionable-dolphin-815.mypinata.cloud/ipfs/bafkreibg7ptr5pstg4ow4iyq2uublhichscosqnhaiepyyv6wudrgr6uxy",
          tokenId: "5678",
          price: "1 MOVE"
        },
        {
          id:"3",
          name: "ETH Global Hackathon",
          date: "July 10, 2025",
          location: "Berlin, Germany",
          ticketTypes: [
            { type: "transferrable", price: "1 MOVE" }
          ],
          image: "https://copper-fashionable-dolphin-815.mypinata.cloud/ipfs/bafkreib6wskjwqcumwwaboyptk2awizubpj5jec7yuai45ochb2n6yt5f4",
          tokenId: "9101",
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
          tokenId: "1121",
          price: "1 MOVE"
        },
        {
          id:"5",
          name: "NFT Exhibition",
          date: "September 18, 2025",
          location: "London, UK",
          ticketTypes: [
            { type: "transferrable", price: "1 MOVE" },
            { type: "soulbound", price: "1 MOVE" }
          ],
          image: "https://copper-fashionable-dolphin-815.mypinata.cloud/ipfs/bafkreiejbp6xr2wqryvbi7gl52vtwx7i44fmpn2r6pd2z53ca7dmjmydlq",
          tokenId: "3141",
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

  const handleBuyTicket = (event: Event) => {
    const selectedType = selectedTicketTypes[event.id];
    const ticketTypeInfo = event.ticketTypes.find(t => t.type === selectedType);
    
    if (!ticketTypeInfo) return;
    
    // Simulate buying a ticket by adding to recent activity
    const newActivity = {
      action: "Minted",
      ticket: event.name,
      ticketType: selectedType === 'transferrable' ? 'Transferrable' : 'Soulbound',
      time: "Just now"
    };

    setRecentActivity([newActivity, ...recentActivity.slice(0, 2)]);

    // You would also handle the actual NFT minting here
    alert(`Purchasing ${selectedType} ticket for ${event.name} at ${ticketTypeInfo.price}`);
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