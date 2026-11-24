import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NexTechArchitect | Amit Kumar, Smart Contract & DeFi Protocol Architect",
  description:
    "Amit Kumar (NexTechArchitect), Smart Contract Engineer and DeFi Protocol Architect designing and deploying multi-contract systems across Ethereum and EVM-compatible mainnets.",
  openGraph: {
    title: "NexTechArchitect | Amit Kumar, DeFi Protocol Architect",
    description:
      "Multi-contract DeFi, ERC-3643 real-world asset, ERC-4626 vault, and ERC-4337 account abstraction systems engineered for Ethereum and EVM mainnets.",
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
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,400;1,600;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="bg-[#FAF6F0] text-[#231712] font-sans antialiased selection:bg-[#E85D04]/15 selection:text-[#E85D04]">
        {children}
      </body>
    </html>
  );
}