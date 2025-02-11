from flask import Blueprint, request, jsonify, redirect, url_for
from database.db import db
from models.user import User
import bcrypt
import jwt
from datetime import datetime, timedelta
from config import Config

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Missing JSON payload."}), 400
        
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')

        if not username or not password:
            return jsonify({"error": "Username and password are required."}), 400

        # Check if the username or email is already taken
        if User.query.filter((User.username == username)).first():
            return jsonify({"error": "User already exists."}), 400

        # Hash the password using bcrypt
        salt = bcrypt.gensalt()
        hashed_pw = bcrypt.hashpw(password.encode('utf-8'), salt)

        new_user = User(
            username=username,
            email=email,
            password_hash=hashed_pw.decode('utf-8')
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            "message": "Registration successful",
            "success": True
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Registration error: {str(e)}")  # Add logging
        return jsonify({"error": "An error occurred during registration"}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON payload."}), 400

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required."}), 400

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "Invalid username or password."}), 401

    # Verify the password with bcrypt
    if not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
        return jsonify({"error": "Invalid username or password."}), 401

    # Generate a JWT token
    payload = {
        "user_id": user.id,
        "exp": datetime.utcnow() + timedelta(hours=1)  # Token expires in 1 hour
    }
    token = jwt.encode(payload, Config.SECRET_KEY, algorithm='HS256')

    return jsonify({"token": token}), 200
