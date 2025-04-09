"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "~~/components/ui/button"
import { Badge } from "~~/components/ui/badge"
import { Card } from "~~/components/ui/card"
import { QrCode, ArrowRightLeft, Lock, Calendar, MapPin, ExternalLink } from "lucide-react"
import Link from "next/link"

interface TicketListProps {
  filter: "all" | "transferrable" | "soulbound"
}

export function TicketList({ filter }: TicketListProps) {
  const [tickets] = useState([
    {
      id: "1",
      name: "Web3 Conference 2023",
      date: "Oct 15, 2023",
      location: "San Francisco, CA",
      type: "transferrable",
      image: "/placeholder.svg?height=120&width=200",
      tokenId: "1234",
    },
    {
      id: "2",
      name: "Blockchain Summit",
      date: "Nov 5, 2023",
      location: "New York, NY",
      type: "soulbound",
      image: "/placeholder.svg?height=120&width=200",
      tokenId: "5678",
    },
    {
      id: "3",
      name: "NFT Exhibition",
      date: "Dec 10, 2023",
      location: "Miami, FL",
      type: "transferrable",
      image: "/placeholder.svg?height=120&width=200",
      tokenId: "9012",
    },
    {
      id: "4",
      name: "ETH Meetup",
      date: "Jan 20, 2024",
      location: "Austin, TX",
      type: "transferrable",
      image: "/placeholder.svg?height=120&width=200",
      tokenId: "3456",
    },
    {
      id: "5",
      name: "Developer Conference",
      date: "Feb 15, 2024",
      location: "Seattle, WA",
      type: "soulbound",
      image: "/placeholder.svg?height=120&width=200",
      tokenId: "7890",
    },
  ])

  const filteredTickets = filter === "all" ? tickets : tickets.filter((ticket) => ticket.type === filter)

  return (
    <div className="space-y-4">
      {filteredTickets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tickets found</p>
        </div>
      ) : (
        filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="overflow-hidden">
            <div className="sm:flex">
              <div className="relative h-40 sm:h-auto sm:w-48">
                <Image src={ticket.image || "/placeholder.svg"} alt={ticket.name} fill className="object-cover" />
              </div>
              <div className="flex-1 p-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{ticket.name}</h3>
                      <Badge variant={ticket.type === "transferrable" ? "default" : "secondary"}>
                        {ticket.type === "transferrable" ? (
                          <ArrowRightLeft className="h-3 w-3 mr-1" />
                        ) : (
                          <Lock className="h-3 w-3 mr-1" />
                        )}
                        {ticket.type === "transferrable" ? "Transferrable" : "Soulbound"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <Calendar className="h-4 w-4" />
                      <span>{ticket.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <MapPin className="h-4 w-4" />
                      <span>{ticket.location}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <ExternalLink className="h-4 w-4" />
                      <span>Token ID: {ticket.tokenId}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:items-end">
                    <Link href={`/ticket/${ticket.id}`}>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <QrCode className="h-4 w-4 mr-2" />
                        View Ticket
                      </Button>
                    </Link>
                    {ticket.type === "transferrable" && (
                      <Button size="sm" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-700">
                        <ArrowRightLeft className="h-4 w-4 mr-2" />
                        Transfer
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}

