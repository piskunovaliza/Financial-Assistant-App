# services/analysis_service.py
from typing import List, Dict
from services.openai_service import analyze_financial_data

def build_financial_prompt(transactions: List[Dict], question: str) -> str:
    """
    Accepts a list of transactions and a user question, and builds a prompt that
    summarizes the transactions and appends the question.
    
    Each transaction is expected to be a dictionary containing fields such as:
      - "amount": numeric value (stored as a string or a number)
      - "description": text describing the transaction
      - "date": a date string (ISO format)
      - "category": a string indicating the category (e.g., "groceries")
      - "transaction_type": a string such as "debit" or "credit"
    """
    if not transactions:
        summary = "There are no transactions recorded."
    else:
        total_spent = 0.0
        total_income = 0.0
        categories = {}
        for tx in transactions:
            try:
                amount = float(tx.get("amount", 0))
            except (ValueError, TypeError):
                amount = 0.0
            # Consider negative amounts or an explicit transaction type.
            t_type = (tx.get("transaction_type") or "").lower()
            if t_type == "debit" or amount < 0:
                total_spent += abs(amount)
            else:
                total_income += amount
            # Count transactions per category (defaulting to "Other" if missing)
            cat = tx.get("category") or "Other"
            categories[cat] = categories.get(cat, 0) + 1
        
        categories_str = ", ".join([f"{cat}: {count}" for cat, count in categories.items()])
        summary = (f"Total income: ${total_income:.2f}. "
                   f"Total spent: ${total_spent:.2f}. "
                   f"Transaction counts by category: {categories_str}.")
    
    # Build a prompt combining the summary and the user's question.
    prompt = (
        f"Based on the following summary of transactions: {summary}\n"
        f"And the following question: {question}\n"
        "Please provide detailed financial advice and analysis."
    )
    return prompt

def get_financial_analysis(transactions: List[Dict], question: str) -> str:
    """
    Constructs the prompt from the given transactions and question, then calls
    the OpenAI service to get financial advice.
    """
    prompt = build_financial_prompt(transactions, question)
    advice = analyze_financial_data(prompt)
    return advice
