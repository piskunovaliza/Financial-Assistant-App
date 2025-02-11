from flask import Blueprint, request, jsonify, current_app
from middleware.jwt_required import token_required
from models.transaction import Transaction
from database.db import db
import json
from datetime import datetime
import traceback

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/upload', methods=['POST'])
@token_required
def upload_transactions(current_user):
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        if not file.filename.endswith('.json'):
            return jsonify({"error": "Only JSON files are allowed"}), 400

        try:
            file_content = file.read().decode('utf-8')
            transactions_json = json.loads(file_content)
        except UnicodeDecodeError:
            return jsonify({"error": "File must be UTF-8 encoded"}), 400
        except json.JSONDecodeError as e:
            return jsonify({"error": f"Invalid JSON format: {str(e)}"}), 400

        if not isinstance(transactions_json, list):
            return jsonify({"error": "JSON must be an array of transactions"}), 400

        if not transactions_json:
            return jsonify({"error": "JSON file is empty"}), 400

        added_count = 0
        errors = []

        for index, tx_data in enumerate(transactions_json):
            try:
                # Validate required fields
                if 'amount' not in tx_data:
                    errors.append(f"Transaction {index + 1}: Missing required field 'amount'")
                    continue

                # Parse amount
                try:
                    amount = float(tx_data.get("amount"))
                except (ValueError, TypeError):
                    errors.append(f"Transaction {index + 1}: Invalid amount format")
                    continue

                description = tx_data.get("description", "")
                date_str = tx_data.get("date")
                
                try:
                    date = datetime.fromisoformat(date_str) if date_str else datetime.utcnow()
                except ValueError:
                    errors.append(f"Transaction {index + 1}: Invalid date format")
                    continue

                category = tx_data.get("category", "Other")
                transaction_type = tx_data.get("transaction_type", "")

                new_tx = Transaction(
                    user_id=current_user.id,
                    amount=amount,
                    description=description,
                    date=date,
                    category=category,
                    transaction_type=transaction_type
                )
                db.session.add(new_tx)
                added_count += 1
            except Exception as e:
                errors.append(f"Transaction {index + 1}: {str(e)}")
                current_app.logger.error(f"Error processing transaction: {traceback.format_exc()}")
                continue

        if added_count == 0:
            db.session.rollback()
            return jsonify({
                "error": "No transactions were processed successfully",
                "details": errors
            }), 400

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Database error: {traceback.format_exc()}")
            return jsonify({"error": f"Error saving transactions: {str(e)}"}), 500

        response_data = {
            "message": f"Successfully uploaded {added_count} transactions."
        }
        if errors:
            response_data["warnings"] = errors

        return jsonify(response_data), 200

    except Exception as e:
        current_app.logger.error(f"Unexpected error: {traceback.format_exc()}")
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500