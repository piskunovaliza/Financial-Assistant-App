"use client"

import { Inter } from "next/font/google"
import "./globals.css"
import type React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AuthProvider, useAuth } from "./providers/AuthProvider"

const inter = Inter({ subsets: ["latin"] })

function Header() {
  const { isAuthenticated, setIsAuthenticated } = useAuth()
  const router = useRouter()

  const handleSignOut = () => {
    document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    setIsAuthenticated(false)
    router.push("/")
  }

  return (
          <header className="border-b">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lime-500 text-2xl">▲</span>
                <span className="font-bold text-xl">FinWise</span>
              </div>
              <nav className="space-x-6">
          <a href="/" className="hover:text-lime-500">Home</a>
          <a href="/about" className="hover:text-lime-500">About</a>
          <a href="/contact" className="hover:text-lime-500">Contact</a>
          {isAuthenticated && (
                <Button variant="default" onClick={handleSignOut}>
                  Sign Out
                </Button>
                )}
              </nav>
            </div>
          </header>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
            <footer className="border-t">
              <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="space-x-6">
                  <a href="/terms" className="hover:text-lime-500">
                    Terms & Conditions
                  </a>
                  <a href="/privacy" className="hover:text-lime-500">
                    Privacy Policy
                  </a>
                  <a href="/support" className="hover:text-lime-500">
                    Support
                  </a>
                </div>
                <div className="space-x-6">
                  <a href="#" className="hover:text-lime-500">
                    Facebook
                  </a>
                  <a href="#" className="hover:text-lime-500">
                    Twitter
                  </a>
                  <a href="#" className="hover:text-lime-500">
                    LinkedIn
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
