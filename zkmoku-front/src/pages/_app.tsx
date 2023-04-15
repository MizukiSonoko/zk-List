// pages/_app.tsx
import React from 'react';
import type { AppProps } from 'next/app';
import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"

import { publicProvider } from "wagmi/providers/public"
import { WagmiConfig, createClient, configureChains } from "wagmi"
import { polygon } from 'wagmi/chains'

export const { chains, provider } = configureChains(
  [polygon],
  [publicProvider()]
)

const client = createClient({
  autoConnect: true,
  provider,
})

export default function App({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {
  return (
    <WagmiConfig client={client}>
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <Component {...pageProps} />
      </SessionProvider>
    </WagmiConfig>
  )
}