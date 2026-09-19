import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/components/layout/CartProvider';
import WhatsAppButton from '@/components/layout/WhatsAppButton';

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nirmalmasale.in"),
  title: "Nirmal Gold | Pure, Stone-Ground Spices Since 2001",
  description:
    "Bring royal aroma and authentic taste to your kitchen. Nirmal Masale hand-selects, cleans and stone-grinds every spice in Dehradun — 100% pure, hygienically packed, trusted by lakhs of Indian homes since 2001.",
  keywords: [
    "Nirmal Masale",
    "spices",
    "masala",
    "Dehradun spices",
    "pure spices India",
    "garam masala",
    "turmeric powder",
    "red chilli powder",
  ],
  openGraph: {
    title: "Nirmal Gold | Pure, Stone-Ground Spices Since 2001",
    description:
      "100% pure, stone-ground spices crafted with passion since 2001. Shop authentic blended, ground and whole spices online.",
    url: "https://nirmalmasale.in",
    siteName: "Nirmal Masale",
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: "/nirmal_gold_masale_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-nirmal-cream">
        <CartProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] bg-nirmal-maroon text-white px-4 py-2 rounded-lg"
          >
            Skip to content
          </a>
          <Header />
          <main id="main-content" className="flex flex-col flex-grow">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}