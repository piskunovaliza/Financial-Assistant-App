export interface Transaction {
    id: string
    name: string
    category: string
    amount: number
    date: string
    type: "income" | "expense"
  }
  
  export interface FinancialData {
    totalBalance: number
    monthlyIncome: number
    monthlyExpenses: number
    transactions: Transaction[]
  }
  
  