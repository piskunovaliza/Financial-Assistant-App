from flask import Flask
from config import Config
from database.db import db
from flask_migrate import Migrate
from flask_cors import CORS
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,  # (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)
logger.info("Logging is set up!")

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)
    
    db.init_app(app)
    Migrate(app, db)

    # Import and register blueprints
    from routers.auth import auth_bp
    from routers.dashboard import dashboard_bp
    from routers.chat import chat_bp
    from routers.upload import upload_bp  # New upload blueprint

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    app.register_blueprint(chat_bp, url_prefix='/api/chat')
    app.register_blueprint(upload_bp, url_prefix='/api/upload')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)