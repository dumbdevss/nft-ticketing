"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "~~/components/theme-toggle"
import { CustomConnectButton } from "~~/components/scaffold-move";


// Simplified version of cn function to avoid potential issues
const classNames = (...classes: (string | boolean | undefined | null)[]) => {
  return classes.filter(Boolean).join(" ")
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname() || ""

  const isActive = (path: string) => pathname === path

  return (
    <header className="container mx-auto px-4 md:px-8  py-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Image src="/placeholder.svg" alt="Logo" width={40} height={40} className="rounded-lg" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          NFTicket
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={classNames(
              "text-gray-700 hover:text-blue-600",
              isActive("/") && "text-blue-600"
            )}
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className={classNames(
              "text-gray-700 hover:text-blue-600",
              isActive("/dashboard") && "text-blue-600"
            )}
          >
            Dashboard
          </Link>
          <Link
            href="/validate"
            className={classNames(
              "text-gray-700 hover:text-blue-600",
              isActive("/validate") && "text-blue-600"
            )}
          >
            Validate
          </Link>
        </nav>
        {/* <ThemeToggle /> */}
        <CustomConnectButton />
        <button className="flex md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6 text-blue-600" /> : <Menu className="h-6 w-6 text-blue-600" />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden p-4 space-y-4 bg-white shadow-lg rounded-lg">
          <Link
            href="/"
            className={classNames(
              "block py-2 text-gray-700 hover:text-blue-600",
              isActive("/") && "text-blue-600"
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className={classNames(
              "block py-2 text-gray-700 hover:text-blue-600",
              isActive("/dashboard") && "text-blue-600"
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/validate"
            className={classNames(
              "block py-2 text-gray-700 hover:text-blue-600",
              isActive("/validate") && "text-blue-600"
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            Validate
          </Link>
        </div>
      )}
    </header>
  )
}
