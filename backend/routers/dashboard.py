from flask import Blueprint, jsonify
from models.transaction import Transaction
from middleware.jwt_required import token_required

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/transactions', methods=['GET'])
@token_required
def get_transactions(current_user):
    transactions = Transaction.query.filter_by(user_id=current_user.id).all()
    transactions_data = []
    for tx in transactions:
        transactions_data.append({
            "id": tx.id,
            "amount": str(tx.amount),  # Convert Numeric to string for JSON serialization
            "description": tx.description,
            "date": tx.date.isoformat(),
            "category": tx.category,
            "transaction_type": tx.transaction_type
        })
    return jsonify({"transactions": transactions_data}), 200

@dashboard_bp.route('/summary', methods=['GET'])
@token_required
def get_summary(current_user):
    transactions = Transaction.query.filter_by(user_id=current_user.id).all()
    total_amount = sum(float(tx.amount) for tx in transactions)
    return jsonify({
        "total_amount": total_amount,
        "transaction_count": len(transactions)
    }), 200

