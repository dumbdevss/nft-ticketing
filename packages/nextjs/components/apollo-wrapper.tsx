"use client"

import React from "react"
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

export function ApolloProviderWrapper({ children }: { children: React.ReactNode }) {
  const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    uri:  "https://indexer.testnet.movementnetwork.xyz/v1/graphql"
  })

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}