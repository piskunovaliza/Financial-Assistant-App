'use client'

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import ReactMarkdown from 'react-markdown';

interface Transaction {
  id: number;
  amount: string;
  description: string;
  date: string;
  category: string;
  transaction_type: string;
}

interface Summary {
  total_amount: number;
  transaction_count: number;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function useFinanceChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchChatResponse = async (query: string): Promise<string> => {
    try {
      const token = document.cookie.split("auth=")[1];
      const response = await fetch("http://localhost:5000/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      return data.advice || "Sorry, no response available.";
    } catch (error) {
      console.error("Error fetching chat response:", error);
      return "Error fetching response.";
    }
  };

  useEffect(() => {
    const getInitialAdvice = async () => {
      setIsLoading(true);
      const initialQuery = "Please provide me with some initial financial advice.";
      const advice = await fetchChatResponse(initialQuery);
      setMessages([{ id: Date.now().toString(), role: "assistant", content: advice }]);
      setIsLoading(false);
    };
    getInitialAdvice();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    const advice = await fetchChatResponse(userMessage.content);
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: advice,
    };
    setMessages((prev) => [...prev, aiMessage]);
    setIsLoading(false);
  };

  return {
    messages,
    input,
    isLoading,
    handleSubmit,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value),
  };
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { messages, input, isLoading: chatIsLoading, handleSubmit, handleInputChange } = useFinanceChat();

    const fetchDashboardData = async () => {
      try {
        const token = document.cookie.split("auth=")[1];
      if (!token) {
        console.error("No auth token found");
        return;
      }

      setIsLoading(true);
      const txResponse = await fetch("http://localhost:5000/api/dashboard/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!txResponse.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const txData = await txResponse.json();
      setTransactions(txData.transactions || []);
      const summaryResponse = await fetch("http://localhost:5000/api/dashboard/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!summaryResponse.ok) {
        throw new Error('Failed to fetch summary');
      }
      const summaryData = await summaryResponse.json();
      setSummary(summaryData);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadMessage("Please select a file first.");
      return;
    }

    try {
      const token = document.cookie.split("auth=")[1];
      if (!token) {
        setUploadMessage("Authentication token not found. Please login again.");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("http://localhost:5000/api/upload/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      setUploadMessage(data.message);

      await fetchDashboardData();

      setSelectedFile(null);
      if (document.querySelector('input[type="file"]')) {
        (document.querySelector('input[type="file"]') as HTMLInputElement).value = '';
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadMessage(error instanceof Error ? error.message : "Error uploading file. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <main className="flex-1 p-8 overflow-auto">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Balance</h3>
              <p className="text-3xl font-bold mt-2">
                ${summary?.total_amount?.toFixed(2) || "0.00"}
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-500">Transaction Count</h3>
              <p className="text-3xl font-bold mt-2">
                {summary?.transaction_count || 0}
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-500">Latest Activity</h3>
              <p className="text-3xl font-bold mt-2">
                {transactions.length > 0 && transactions[0]?.date
                  ? new Date(transactions[0].date).toLocaleDateString()
                  : "No transactions"}
              </p>
            </Card>
          </div>

          {transactions.length === 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">No Transactions Found</h2>
              <p>
                You don't have any transactions right now, but you can upload a JSON file with your transactions.
              </p>
              <div className="mt-4 flex items-center">
                <Input type="file" accept=".json" onChange={handleFileChange} />
                <Button onClick={handleUpload} className="ml-2">
                  Upload JSON
                </Button>
              </div>
              {uploadMessage && (
                <p className="mt-2 text-sm text-green-600">{uploadMessage}</p>
              )}
            </Card>
          )}

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Financial Advisor Chat</h2>
            <div className="space-y-4 mb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded ${
                    msg.role === "assistant" ? "bg-gray-100" : "bg-blue-100"
                  }`}
                >
                  <ReactMarkdown
                    className="prose prose-sm max-w-none"
                    components={{
                      strong: ({ node, ...props }) => (
                        <span className="font-semibold" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc ml-4 space-y-1" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal ml-4 space-y-1" {...props} />
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ))}
              {chatIsLoading && <p>Loading...</p>}
            </div>
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Ask your financial question..."
                className="flex-1"
              />
              <Button type="submit" disabled={chatIsLoading}>
                Send
              </Button>
            </form>
          </Card>
        </div>
        )}
      </main>
    </div>
  );
}