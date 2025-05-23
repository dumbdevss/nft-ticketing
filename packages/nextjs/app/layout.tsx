import type React from "react"
import "~~/app/globals.css"
import { ThemeProvider } from "~~/components/theme-provider"
import { Toaster } from "~~/components/ui/toaster";
import {ApolloProviderWrapper} from "~~/components/apollo-wrapper"
import { ScaffoldMoveAppWithProviders } from "~~/components/ScaffoldMoveAppWithProviders";

export const metadata = {
  title: "NFTicket - Blockchain-Powered Event Tickets",
  description: "Mint, transfer, and validate event tickets as NFTs",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ScaffoldMoveAppWithProviders>
            <ApolloProviderWrapper>

            {children}
            <Toaster />

            </ApolloProviderWrapper>
          </ScaffoldMoveAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'