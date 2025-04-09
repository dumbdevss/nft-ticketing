"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card"
import { Button } from "~~/components/ui/button"
import { Input } from "~~/components/ui/input"
import { QrScanner } from "~~/components/qr-scanner"
import Navbar from "~~/components/navbar"
import { CheckCircle2, XCircle, Scan } from "lucide-react"

export default function ValidatePage() {
  const [validationState, setValidationState] = useState<"idle" | "valid" | "invalid">("idle")
  const [ticketData, setTicketData] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [ticketId, setTicketId] = useState("")

  const handleScan = (data: string) => {
    try {
      const parsedData = JSON.parse(data)
      setTicketData(parsedData)
      // In a real app, you would validate this against your backend
      setValidationState("valid")
      setIsScanning(false)
    } catch (error) {
      setValidationState("invalid")
      setIsScanning(false)
    }
  }

  const handleManualValidation = () => {
    if (!ticketId.trim()) return

    // In a real app, you would validate this against your backend
    if (ticketId === "1234" || ticketId === "5678") {
      setTicketData({
        ticketId: ticketId,
        event: ticketId === "1234" ? "Web3 Conference 2023" : "Blockchain Summit",
        date: ticketId === "1234" ? "Oct 15, 2023" : "Nov 5, 2023",
      })
      setValidationState("valid")
    } else {
      setValidationState("invalid")
    }
  }

  const resetValidation = () => {
    setValidationState("idle")
    setTicketData(null)
    setTicketId("")
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-12">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Validate Ticket</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Scan QR Code</CardTitle>
              <CardDescription>Use your camera to scan a ticket QR code</CardDescription>
            </CardHeader>
            <CardContent>
              {isScanning ? (
                <div className="aspect-square max-w-md mx-auto relative">
                  <QrScanner onScan={handleScan} onError={() => setValidationState("invalid")} />
                  <Button
                    variant="outline"
                    className="absolute bottom-4 right-4 z-10"
                    onClick={() => setIsScanning(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsScanning(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-700"
                >
                  <Scan className="h-4 w-4 mr-2" />
                  Start Scanning
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manual Validation</CardTitle>
              <CardDescription>Enter the ticket ID or token ID</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter ticket ID or token ID"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                />
                <Button onClick={handleManualValidation}>Validate</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {validationState !== "idle" && (
          <Card className={`mt-8 ${validationState === "valid" ? "border-green-500" : "border-red-500"}`}>
            <CardHeader>
              <div className="flex items-center gap-2">
                {validationState === "valid" ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
                <CardTitle>{validationState === "valid" ? "Ticket Valid" : "Invalid Ticket"}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {validationState === "valid" && ticketData ? (
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Event:</span> {ticketData.event}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span> {ticketData.date}
                  </p>
                  <p>
                    <span className="font-medium">Ticket ID:</span> {ticketData.ticketId}
                  </p>
                  <div className="mt-4">
                    <Button onClick={() => setValidationState("idle")} className="bg-green-500 hover:bg-green-600">
                      Mark as Used
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p>This ticket is invalid or has already been used.</p>
                  <div className="mt-4">
                    <Button onClick={resetValidation} variant="outline">
                      Try Again
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

