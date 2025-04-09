import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/tabs"
import { Button } from "~~/components/ui/button"
import { Badge } from "~~/components/ui/badge"
import { TicketList } from "~~/components/ticket-list"
import Navbar from "~~/components/navbar"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-12">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Transferrable</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Soulbound</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">4</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    <TicketList filter="all" />
                  </TabsContent>
                  <TabsContent value="transferrable">
                    <TicketList filter="transferrable" />
                  </TabsContent>
                  <TabsContent value="soulbound">
                    <TicketList filter="soulbound" />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Mint New Ticket</CardTitle>
                <CardDescription>Create a new NFT ticket</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-700">Mint Transferrable Ticket</Button>
                <Button variant="outline" className="w-full border-blue-500 text-blue-600 dark:text-blue-400">
                  Mint Soulbound Ticket
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent ticket activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "Minted", ticket: "Web3 Conference", time: "2 hours ago" },
                    { action: "Transferred", ticket: "ETH Meetup", time: "1 day ago" },
                    { action: "Validated", ticket: "Blockchain Summit", time: "3 days ago" },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium text-sm">
                          {activity.action} {activity.ticket}
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      <Badge variant="outline">{activity.action}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

