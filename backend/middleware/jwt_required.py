import jwt
from functools import wraps
from flask import request, jsonify
from config import Config
from models.user import User

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Expect token in the "Authorization" header in the form "Bearer <token>"
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({"error": "Token is missing!"}), 401
        
        try:
            # Decode the token using the secret key and the HS256 algorithm
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
            # Retrieve the user by id from the token payload
            current_user = User.query.get(data["user_id"])
            if not current_user:
                return jsonify({"error": "User not found."}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token."}), 401

        # Pass current_user to the endpoint function
        return f(current_user, *args, **kwargs)
    return decorated