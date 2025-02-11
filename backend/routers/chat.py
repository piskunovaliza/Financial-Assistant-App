from flask import Blueprint, request, jsonify
from middleware.jwt_required import token_required
from services.openai_service import get_financial_advice

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/', methods=['POST'])
@token_required
def chat(current_user):
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON payload."}), 400
    
    query = data.get('query')
    if not query:
        return jsonify({"error": "Query is required."}), 400

    # You can optionally enrich the prompt by summarizing user transactions here.
    advice = get_financial_advice(query)
    return jsonify({"advice": advice}), 200
