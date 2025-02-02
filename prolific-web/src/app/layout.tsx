import { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { PreferencesProvider } from "@/contexts/PreferencesContext"
import { DataProvider } from "../contexts/DataContext"
import AuthGuard from "@/components/AuthGuard"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Prolific",
  description: "Duolingo for Career Growth",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PreferencesProvider>
          <DataProvider>
            <AuthGuard>
              {children}
            </AuthGuard>
          </DataProvider>
        </PreferencesProvider>
      </body>
    </html>
  )
}
