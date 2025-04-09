"use client"

import { useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card"
import { Button } from "~~/components/ui/button"
import { Badge } from "~~/components/ui/badge"
import { QrCode, ArrowRightLeft, Lock, Calendar, MapPin, TrendingUp, Users, Ticket, Clock } from "lucide-react"

export function DashboardPreview() {
  const [activeTab, setActiveTab] = useState("overview")

  const tickets = [
    {
      id: "1",
      name: "Web3 Conference 2023",
      date: "Oct 15, 2023",
      location: "San Francisco, CA",
      type: "transferrable",
      image: "/placeholder.svg",
      price: "0.05 ETH",
      status: "Active",
    },
    {
      id: "2",
      name: "Blockchain Summit",
      date: "Nov 5, 2023",
      location: "New York, NY",
      type: "soulbound",
      image: "/placeholder.svg",
      price: "0.08 ETH",
      status: "Active",
    },
    {
      id: "3",
      name: "NFT Exhibition",
      date: "Dec 10, 2023",
      location: "Miami, FL",
      type: "transferrable",
      image: "/placeholder.svg",
      price: "0.03 ETH",
      status: "Active",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">NFT Ticket Dashboard</h2>
          <p className="text-gray-500">Manage your blockchain-powered event tickets</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
            <Clock className="h-3 w-3 mr-1" />
            Last updated: Just now
          </Badge>
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100">
            <Users className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Total Tickets", value: "12", icon: Ticket, color: "blue" },
          { title: "Transferrable", value: "8", icon: ArrowRightLeft, color: "indigo" },
          { title: "Soulbound", value: "4", icon: Lock, color: "violet" },
          { title: "Value", value: "0.72 ETH", icon: TrendingUp, color: "purple" },
        ].map((stat, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`rounded-full p-2 bg-${stat.color}-100`}>
                <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Dashboard Content */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b bg-gray-50 rounded-t-lg">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-bold">Your Tickets</CardTitle>
            <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <div className="px-4 pt-4">
              <TabsList className="grid grid-cols-3 mb-4 bg-gray-100">
                <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="transferrable"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
                >
                  Transferrable
                </TabsTrigger>
                <TabsTrigger
                  value="soulbound"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600"
                >
                  Soulbound
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value={activeTab} className="m-0">
              <div className="divide-y">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={ticket.image || "/placeholder.svg"}
                          alt={ticket.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-sm truncate">{ticket.name}</h3>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Calendar className="h-3 w-3" />
                                <span>{ticket.date}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin className="h-3 w-3" />
                                <span>{ticket.location}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                                {ticket.price}
                              </Badge>
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                {ticket.status}
                              </Badge>
                            </div>
                          </div>
                          <Badge
                            variant={ticket.type === "transferrable" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {ticket.type === "transferrable" ? (
                              <ArrowRightLeft className="h-3 w-3 mr-1" />
                            ) : (
                              <Lock className="h-3 w-3 mr-1" />
                            )}
                            {ticket.type === "transferrable" ? "Transferrable" : "Soulbound"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 px-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          <QrCode className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        {ticket.type === "transferrable" && (
                          <Button size="sm" className="text-xs h-7 px-2 bg-gradient-to-r from-blue-600 to-indigo-600">
                            <ArrowRightLeft className="h-3 w-3 mr-1" />
                            Transfer
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b bg-gray-50 rounded-t-lg">
          <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {[
              { action: "Minted", ticket: "Web3 Conference", time: "2 hours ago", type: "mint" },
              { action: "Transferred", ticket: "ETH Meetup", time: "1 day ago", type: "transfer" },
              { action: "Validated", ticket: "Blockchain Summit", time: "3 days ago", type: "validate" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-full p-2 ${
                      activity.type === "mint"
                        ? "bg-green-100"
                        : activity.type === "transfer"
                          ? "bg-blue-100"
                          : "bg-amber-100"
                    }`}
                  >
                    {activity.type === "mint" ? (
                      <Ticket className={`h-4 w-4 text-green-600`} />
                    ) : activity.type === "transfer" ? (
                      <ArrowRightLeft className={`h-4 w-4 text-blue-600`} />
                    ) : (
                      <QrCode className={`h-4 w-4 text-amber-600`} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {activity.action} {activity.ticket}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`
                  ${
                    activity.type === "mint"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : activity.type === "transfer"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                  }
                `}
                >
                  {activity.action}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

