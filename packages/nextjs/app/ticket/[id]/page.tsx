"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card"
import { Button } from "~~/components/ui/button"
import { Badge } from "~~/components/ui/badge"
import { QRCodeSVG } from "qrcode.react"
import Navbar from "~~/components/navbar"
import { ArrowLeft, Calendar, MapPin, ArrowRightLeft, Lock, ExternalLink } from "lucide-react"

export default function TicketPage() {
  const params = useParams()
  const { id } = params

  const [ticket, setTicket] = useState({
    id: id as string,
    name: "Web3 Conference 2023",
    date: "Oct 15, 2023",
    time: "9:00 AM - 5:00 PM",
    location: "San Francisco Convention Center",
    address: "123 Tech Blvd, San Francisco, CA",
    type: "transferrable",
    image: "/placeholder.svg?height=300&width=600",
    tokenId: "1234",
    owner: "0x1234...5678",
    description:
      "Join us for the biggest Web3 event of the year featuring keynotes, workshops, and networking opportunities with industry leaders.",
  })

  // In a real app, you would fetch the ticket data based on the ID
  useEffect(() => {
    // Simulate fetching ticket data
    if (id === "2") {
      setTicket((prev) => ({
        ...prev,
        name: "Blockchain Summit",
        date: "Nov 5, 2023",
        location: "New York Conference Center",
        type: "soulbound",
        tokenId: "5678",
      }))
    }
  }, [id])

  const qrValue = JSON.stringify({
    ticketId: ticket.id,
    tokenId: ticket.tokenId,
    event: ticket.name,
    date: ticket.date,
  })

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-12">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="relative h-48 sm:h-64 md:h-80">
                <Image src={ticket.image || "/placeholder.svg"} alt={ticket.name} fill className="object-cover" />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{ticket.name}</CardTitle>
                    <CardDescription>{ticket.description}</CardDescription>
                  </div>
                  <Badge variant={ticket.type === "transferrable" ? "default" : "secondary"} className="ml-2">
                    {ticket.type === "transferrable" ? (
                      <ArrowRightLeft className="h-3 w-3 mr-1" />
                    ) : (
                      <Lock className="h-3 w-3 mr-1" />
                    )}
                    {ticket.type === "transferrable" ? "Transferrable" : "Soulbound"}
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
                        <p className="text-sm text-muted-foreground">{ticket.date}</p>
                        <p className="text-sm text-muted-foreground">{ticket.time}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{ticket.location}</p>
                        <p className="text-sm text-muted-foreground">{ticket.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="font-medium mb-2">Ticket Details</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Token ID</span>
                      <span className="text-sm font-medium">{ticket.tokenId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Owner</span>
                      <span className="text-sm font-medium">{ticket.owner}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {ticket.type === "transferrable" && (
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
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <Button className="bg-gradient-to-r from-blue-500 to-blue-700">Transfer</Button>
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
                  <QRCodeSVG value={qrValue} size={200} />
                </div>
                <p className="text-sm text-center text-muted-foreground mb-4">
                  Present this QR code at the event entrance for validation
                </p>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Blockchain
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

