"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "~~/components/ui/button"
import { Badge } from "~~/components/ui/badge"
import { Card } from "~~/components/ui/card"
import { QrCode, ArrowRightLeft, Lock, Calendar, MapPin, ExternalLink } from "lucide-react"
import Link from "next/link"

interface TicketListProps {
  tickets: any[]
}

export function TicketList({tickets }: TicketListProps) {

  return (
    <div className="space-y-4">
      {tickets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tickets found</p>
        </div>
      ) : (
        tickets.map((ticket) => (
          <Card key={ticket.id} className="overflow-hidden">
            <div className="sm:flex">
              <div className="relative h-40 sm:h-auto sm:w-48">
                <img src={ticket.image || "/placeholder.svg"} alt={ticket.name} className="object-cover w-full h-full" />
              </div>
              <div className="flex-1 p-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{ticket.name}</h3>
                      <Badge variant={ticket.is_soulbound ? "secondary" : "default"}>
                      {ticket.is_soulbound ? (
                        <Lock className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowRightLeft className="h-3 w-3 mr-1" />
                      )}
                      {ticket.is_soulbound ? "Soulbound" : "Transferrable"}
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
                      <span>Token ID: {ticket?.ticket_id}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:items-end">
                    <Link href={`/ticket/${ticket?.ticket_id}`}>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
                        <QrCode className="h-4 w-4 mr-2" />
                        View Ticket
                      </Button>
                    </Link>
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

