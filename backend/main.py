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


def create_app(config=DevConfig):
    # Create Flask application instance
    app = Flask(__name__)

    # Load configuration from DevConfig class
    app.config.from_object(config)

    # Set the upload folder for images
    app.config['UPLOAD_FOLDER'] = '../Images'

    # Set the allowed file extensions for uploaded files
    app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'}

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


    @app.shell_context_processor
    def make_shell_context():
        return {'db': db, 'Message': Message, 'Account': Account, 'Conversation': Conversation, 'APIKey': APIKey} 
    
    return app

"""# Define a model for the Account resource, this is used to serialize the data
account_model = api.model('Account', {
    'id': fields.Integer(),
    'name': fields.String(),
    'username': fields.String(),
    'email': fields.String(),
    'password': fields.String(),
    'role': fields.String()    
})

# Define a model for the Signup resource, this is used to serialize the data
signup_model = api.model('Signup', {
    'name': fields.String(),
    'username': fields.String(),
    'email': fields.String(),
    'password': fields.String()
})

# Define a model for the APIKey resource, this is used to serialize the data
api_key_model = api.model('APIKey', {
    'id': fields.Integer(),
    'api_key': fields.String(),
    'account_id': fields.Integer()
})

# Define a model for the Conversation resource, this is used to serialize the data
conversation_model = api.model('Conversation', {
    'id': fields.Integer(),
    'title': fields.String(),
    'image_path': fields.String(),
    'date_created': fields.Date(),
    'summary': fields.String(),
    'account_id': fields.Integer()
})

# Define a model for the Message resource, this is used to serialize the data
message_model = api.model('Message', {
    'id': fields.Integer(),
    'content': fields.String(),
    'message_number': fields.Integer(),
    'conversation_id': fields.Integer()
})

# Define a resource for the '/hello' endpoint
@api.route('/hello', methods=['GET'])
class HelloResource(Resource):
    def get(self):
        return {'message': 'world'}
    



# Define a resource for the '/accounts' endpoint
@api.route('/accounts', methods=['POST'])
class AccountsResource(Resource):
    @api.marshal_with(account_model)
    @api.expect(account_model)
    def post(self):
        data = request.get_json()
        
        new_account = Account(name=data.get('name'), username=data.get('username'), email=data.get('email'), password=data.get('password'), role=data.get('role'))
        
        new_account.save()
        
        return new_account, 201
    """





    
