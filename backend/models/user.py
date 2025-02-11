from datetime import datetime
from database.db import db

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    # Unique username, required
    username = db.Column(db.String(80), unique=True, nullable=False)
    # Email can be required or optional as per your business rules.
    email = db.Column(db.String(120), unique=True, nullable=True)
    # Store the hashed password (including salt, e.g. from bcrypt)
    password_hash = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationship to the transactions table. One user may have many transactions.
    transactions = db.relationship('Transaction', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'
