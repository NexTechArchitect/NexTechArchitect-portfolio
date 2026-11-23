import "./globals.css";
import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
} from "next/font/google";

const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

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
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} scroll-smooth`}
    >
      <body className="bg-[#F8FAFC] text-[#0B1220] font-sans antialiased selection:bg-[#0052FF]/15 selection:text-[#0052FF]">
        {children}
      </body>
    </html>
  );
}