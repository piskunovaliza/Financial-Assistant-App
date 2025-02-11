import openai
from typing import List, Dict
from config import Config
from models.transaction import Transaction
client = openai.OpenAI(api_key=Config.OPENAI_API_KEY)

def build_transaction_context(transactions: List[Transaction]) -> str:
    if not transactions:
        return "No transaction history available."

    total_income = sum(float(tx.amount) for tx in transactions if tx.transaction_type == 'credit')
    total_expenses = sum(float(tx.amount) for tx in transactions if tx.transaction_type == 'debit')

    categories = {}
    for tx in transactions:
        cat = tx.category or "Uncategorized"
        categories[cat] = categories.get(cat, 0) + float(tx.amount)

        context = f"""
Transaction Summary:
- Total Income: ${total_income:.2f}
- Total Expenses: ${total_expenses:.2f}
- Net Balance: ${(total_income - total_expenses):.2f}
- Number of Transactions: {len(transactions)}

Top spending categories:
{' '.join(f'- {cat}: ${amount:.2f}\n' for cat, amount in sorted(categories.items(), key=lambda x: abs(x[1]), reverse=True)[:3])}
        """
    return context

def get_initial_message(transactions: List[Transaction]) -> str:
    context = build_transaction_context(transactions)

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful financial advisor. Provide a warm welcome and initial financial insights based on the user's transaction data."},
                {"role": "user", "content": f"Here is my transaction data:\n{context}\n\nPlease provide a welcoming message and initial financial insights."}
            ]
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error generating initial message: {str(e)}"

def get_financial_advice(query: str, transactions: List[Transaction]) -> str:
    context = build_transaction_context(transactions)

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful financial advisor. Provide specific advice based on the user's transaction data and their question."},
                {"role": "user", "content": f"""
Context:
{context}

User Question:
{query}

Please provide specific financial advice based on my transaction history and question."""}
            ]
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error obtaining advice: {str(e)}"
