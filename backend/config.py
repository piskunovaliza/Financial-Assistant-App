import os
from dotenv import load_dotenv

# Load environment variables from a .env file (if present)
load_dotenv()

class Config:
    # Flask secret key (used for session signing, etc.)
    SECRET_KEY = os.environ.get("SECRET_KEY", "default-secret-key")

    # SQLAlchemy settings for PostgreSQL; e.g., "postgresql://username:password@host:port/database"
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URI", "postgresql://user:password@localhost/dbname")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # OpenAI API key for calling GPT
    OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
    
    # Other config settings can be added here as needed
