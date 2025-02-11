from flask import Blueprint, request, jsonify
from middleware.jwt_required import token_required
from services.openai_service import get_financial_advice, get_initial_message
from models.transaction import Transaction

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/initial', methods=['GET'])
@token_required
def get_initial_advice(current_user):
    transactions = Transaction.query.filter_by(user_id=current_user.id).all()
    initial_message = get_initial_message(transactions)
    return jsonify({"advice": initial_message}), 200

@chat_bp.route('/', methods=['POST'])
@token_required
def chat(current_user):
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON payload."}), 400
    
    query = data.get('query')
    if not query:
        return jsonify({"error": "Query is required."}), 400

    # Get user's transactions for context
    transactions = Transaction.query.filter_by(user_id=current_user.id).all()
    
    # Get advice with transaction context
    advice = get_financial_advice(query, transactions)
    return jsonify({"advice": advice}), 200
