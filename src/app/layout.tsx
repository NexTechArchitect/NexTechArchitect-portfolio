import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NexTechArchitect | Amit Kumar, Smart Contract & DeFi Protocol Architect",
  description:
    "Smart Contract Engineer and DeFi Protocol Architect. Six production DeFi protocols deployed on Base Mainnet spanning ERC-3643 RWA compliance, ERC-4626 Aave V3 vaults, O(1) keeper automation, and 50x perpetuals infrastructure.",
  openGraph: {
    title: "NexTechArchitect | Amit Kumar, DeFi Protocol Architect",
    description:
      "Production DeFi architecture on Base Mainnet: ERC-3643 RWA tokenization, ERC-4626 Aave V3 vaults, O(1) Yul automation, Foundry invariant fuzzing, and Slither static analysis.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="bg-[#F8FAFC] text-[#0B1220] font-sans antialiased selection:bg-[#0052FF]/15 selection:text-[#0052FF]">
        {children}
      </body>
    </html>
  );
}