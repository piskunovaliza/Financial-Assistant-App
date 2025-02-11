from datetime import datetime
from database.db import db

class Transaction(db.Model):
    __tablename__ = 'transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    # Foreign key to the users table
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    # For financial amounts, using Numeric is often preferred to avoid floating-point issues.
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    # Optional text description of the transaction.
    description = db.Column(db.String(255), nullable=True)
    # The date of the transaction.
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    # Optional field to categorize the transaction (e.g., "groceries", "utilities").
    category = db.Column(db.String(80), nullable=True)
    # For example, this field could be 'credit' or 'debit'
    transaction_type = db.Column(db.String(10), nullable=True)
    
    def __repr__(self):
        return f'<Transaction {self.id} - Amount: {self.amount}>'
