import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";
import Header from "./dashboard/_components/Header";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap"
});

export default function RootLayout({ children }) {

  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={` ${outfit.className} antialiased`}
        >
          {/* <Header /> */}
          <Provider>
            {children}
          </Provider>
          <Toaster position="top-center" richColors theme="light" />
        </body>
      </html>
    </ClerkProvider>
  );
}
