"use client"

import { useState } from "react"
import type { Message } from "ai"
import { Search, Upload, Send, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Create a custom hook for chat functionality
function useFinanceChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsLoading(true)
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    try {
      // Simulate AI response - replace with actual API call
      const response = await new Promise<string>((resolve) =>
        setTimeout(
          () => resolve("I've analyzed your financial query. Based on your current spending patterns..."),
          1000,
        ),
      )

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Failed to get AI response:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    messages,
    input,
    isLoading,
    handleSubmit,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value),
  }
}

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const auth = cookieStore.get("auth")
  const [file, setFile] = useState<File | null>(null)
  const { messages, input, isLoading, handleSubmit, handleInputChange } = useFinanceChat()

  if (!auth) {
    redirect("/")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <span className="text-lime-500 text-2xl">▲</span>
          <span className="font-bold text-xl">FinWise</span>
        </div>

        <nav className="space-y-4">
          <a href="#" className="flex items-center space-x-3 text-lime-600 font-medium">
            <Menu className="h-5 w-5" />
            <span>Overview</span>
          </a>
          {/* Add other navigation items */}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input className="pl-10 bg-white" placeholder="Search transactions, categories, and accounts" />
          </div>

          {/* Financial Overview */}
          <div className="grid grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
              <p className="text-3xl font-bold mt-2">$9,876.33</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-500">Monthly Income</h3>
              <p className="text-3xl font-bold mt-2 text-green-600">$20,850</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-500">Monthly Expenses</h3>
              <p className="text-3xl font-bold mt-2 text-red-600">$10,100</p>
            </Card>
          </div>

          {/* AI Chat Section */}
          <Card className="p-6">
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Financial AI Assistant</h2>

              {/* Chat Messages */}
              <div className="h-64 overflow-auto border rounded-lg p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.role === "user" ? "bg-lime-500 text-white" : "bg-gray-100"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* File Upload */}
              <div className="flex items-center space-x-4">
                <Button variant="outline" className="flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload Transactions</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    accept=".csv,.xlsx"
                  />
                </Button>
                {file && <span className="text-sm text-gray-500">{file.name}</span>}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSubmit} className="flex space-x-4">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about your finances..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>

          {/* Transaction Summary */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Transaction Summary</h2>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="income">Income</TabsTrigger>
                  <TabsTrigger value="expenses">Expenses</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Transaction List */}
            <div className="space-y-4">
              {[
                {
                  name: "Food Expenses",
                  category: "Food and Dining",
                  amount: -189.36,
                  icon: "🍔",
                },
                {
                  name: "Shopping Expenses",
                  category: "Online Shopping",
                  amount: -350.0,
                  icon: "🛍️",
                },
                {
                  name: "Salary Deposit",
                  category: "Income",
                  amount: 5000.0,
                  icon: "💰",
                },
              ].map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{transaction.icon}</span>
                    <div>
                      <p className="font-medium">{transaction.name}</p>
                      <p className="text-sm text-gray-500">{transaction.category}</p>
                    </div>
                  </div>
                  <span className={`font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                    {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}

