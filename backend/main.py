from flask import Flask
from flask_restx import Api
from models import Account, Message, Conversation, APIKey
from exts import db
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from auth import auth_ns
from accounts import accounts_ns
from api_key import api_key_ns
from messages import messages_ns
from conversations import conversations_ns


def create_app(config):
    # Create Flask application instance
    app = Flask(__name__)

    # Load configuration from DevConfig class
    app.config.from_object(config)

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
    api.add_namespace(accounts_ns)
    api.add_namespace(api_key_ns)
    api.add_namespace(messages_ns)
    api.add_namespace(conversations_ns)
    

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





    
