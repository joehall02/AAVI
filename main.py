from flask import Flask
from flask_restx import Api
from models import Account, Message, Conversation, APIKey
from config import DevConfig
from exts import db
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from api.authentification import auth_ns
from api.account import account_ns
from api.gallery import gallery_ns
from api.image_analysis import image_analysis_ns
from api.admin_settings import admin_settings_ns
from api.audio import audio_ns
from api.images import images_ns
from flask_cors import CORS
import os


def create_app(config=DevConfig):
    # Create Flask application instance
    app = Flask(__name__, static_url_path='/',static_folder='./client/build')

    # Load configuration from DevConfig class
    app.config.from_object(config)

    # Enable CORS
    CORS(app)

    # Set the upload folder for images
    app.config['UPLOAD_FOLDER'] = './Images'

    # Set the upload folder for audio files
    app.config['AUDIO_UPLOAD_FOLDER'] = './Audio'

    # Check if the "Images" folder exists, create it if it doesn't
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    # Check if the "Audio" folder exists, create it if it doesn't
    if not os.path.exists(app.config['AUDIO_UPLOAD_FOLDER']):
        os.makedirs(app.config['AUDIO_UPLOAD_FOLDER'])

    # Set the allowed file extensions for uploaded files
    app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'webp'}

    # Initialize the database
    db.init_app(app)

    # Initialize the Flask-Migrate extension
    migrate = Migrate(app, db)

    # Initialize the Flask-JWT-Extended extension
    jwt = JWTManager(app)

    # Create Flask-RestX API instance
    api = Api(app, doc='/docs')

    # Add the namespaces to the API
    api.add_namespace(auth_ns)
    api.add_namespace(account_ns)
    api.add_namespace(gallery_ns)
    api.add_namespace(image_analysis_ns)
    api.add_namespace(admin_settings_ns)
    api.add_namespace(images_ns)
    api.add_namespace(audio_ns)

    @app.route('/')
    def index():
        return app.send_static_file('index.html')
    
    @app.errorhandler(404)
    def not_found(e):
        return app.send_static_file('index.html')

    @app.shell_context_processor
    def make_shell_context():
        return {'db': db, 'Message': Message, 'Account': Account, 'Conversation': Conversation, 'APIKey': APIKey} 
    
    return app



    
