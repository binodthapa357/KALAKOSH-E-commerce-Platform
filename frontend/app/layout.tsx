"use client";

import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import { AppProvider } from "@/context/AppContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Check if the current path is an admin route
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <html lang="en">
      <body>
        <AppProvider>
          {!isAdminRoute && <Navbar />}
          <main>{children}</main>
          {!isAdminRoute && <Footer />}
        </AppProvider>
      </body>
    </html>
  );
}