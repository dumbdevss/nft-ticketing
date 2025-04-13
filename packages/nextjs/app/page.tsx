import Link from "next/link"
import Image from "next/image"
import { Button } from "~~/components/ui/button"
import { ThemeToggle } from "~~/components/theme-toggle"
import { DashboardPreview } from "~~/components/dashboard-preview"
import Navbar from "~~/components/navbar"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />
      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-8  pt-16 pb-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div>
            <h2 className="text-sm font-medium text-blue-600 mb-2">NEXT GENERATION TICKETING</h2>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight mb-6">
              Blockchain-Powered Event Tickets
            </h1>
          </div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
            Mint, transfer, and validate event tickets as NFTs. Choose between transferrable tickets or soul-bound
            tickets that stay with the original owner.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 border-2 border-white"
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-bold">1,000+</span> tickets minted this month
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Button variant="outline">
              <Link href="/events" className="flex items-center gap-2">
                But Ticket
              </Link>
            </Button>

            <Button>
              <Link href="/validate" className="flex items-center gap-2">
                Validate Ticket
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="container mx-auto px-4 md:px-8  pb-24">
        <div className="relative max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-xl blur-xl" />
          <div className="relative bg-white p-6 rounded-xl shadow-xl border border-gray-100">
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 md:px-8 ">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/placeholder.svg"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  NFTicket
                </h2>
              </div>
              <p className="text-gray-600 mb-4 max-w-md">
                The next generation of event ticketing powered by blockchain technology. Secure, transparent, and
                flexible.
              </p>
              <div className="flex gap-4">
                {["Twitter", "Discord", "GitHub"].map((social) => (
                  <Link key={social} href="#" className="text-gray-600 hover:text-blue-600">
                    {social}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-900">Platform</h3>
              <ul className="space-y-2">
                {["Dashboard", "Mint Ticket", "Validate", "Transfer"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-gray-600 hover:text-blue-600">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-300 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">© {new Date().getFullYear()} NFTicket. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-sm text-gray-600 hover:text-blue-600">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-blue-600">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

