from flask import Flask, request, jsonify
from flask_restx import Api, Resource, fields
from config import DevConfig
from models import Account, Message, Conversation, APIKey
from exts import db
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash

# Create Flask application instance
app = Flask(__name__)

# Load configuration from DevConfig class
app.config.from_object(DevConfig)

# Initialize the database
db.init_app(app)

# Initialize the Flask-Migrate extension
migrate = Migrate(app, db)

# Create Flask-RestX API instance
api = Api(app, doc='/docs')

# Define a model for the Account resource, this is used to serialize the data
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
    



@api.route('/login', methods=['POST'])
class LoginResource(Resource):
    @api.marshal_with(account_model)
    @api.expect(account_model)
    def post(self):
        data = request.get_json()
        
        account = Account.query.filter_by(username=data.get('username')).first()
        
        if account and account.password == data.get('password'):
            return {'message': 'Login successful'}, 200
        else:
            return {'message': 'Invalid credentials'}, 401
    
@api.route('/signup', methods=['POST'])
class SignupResource(Resource):
    @api.expect(account_model)
    def post(self):
        data = request.get_json()
        
        # Check if the account with the username already exists
        username = data.get('username')

        db_user = Account.query.filter_by(username=username).first()

        if db_user is not None:
            return {'message': f'Username {username} already exists'}, 400

        # Create a new account if the username does not exist
        new_account = Account(name=data.get('name'), username=data.get('username'), email=data.get('email'), password=generate_password_hash(data.get('password')), role=('User')) # set default role to 'User'. Password hashing is also done here
        
        new_account.save()
        
        return {'message': 'Account created successfully'}, 201
    
"""# Define a resource for the '/accounts' endpoint
@api.route('/accounts', methods=['POST'])
class AccountsResource(Resource):
    @api.marshal_with(account_model)
    @api.expect(account_model)
    def post(self):
        data = request.get_json()
        
        new_account = Account(name=data.get('name'), username=data.get('username'), email=data.get('email'), password=data.get('password'), role=data.get('role'))
        
        new_account.save()
        
        return new_account, 201"""
    
# Define a resource for the '/accounts/<int:account_id>' endpoint
@api.route('/accounts/<int:account_id>', methods=['GET', 'PUT', 'DELETE'])
class AccountResource(Resource):
    @api.marshal_with(account_model)
    def get(self, account_id):
        account = Account.query.get(account_id)
        
        return account
    
    @api.marshal_with(account_model)
    @api.expect(account_model)
    def put(self, account_id):
        account = Account.query.get(account_id)
        data = request.get_json()
        
        account.username = data.get('username')
        account.password = data.get('password')
        
        account.save()
        
        return account
        
    def delete(self, account_id):
        account = Account.query.get(account_id)
        
        account.delete()
        
        return {'message': 'Account deleted successfully'}, 200
        
    
# Define a resource for the '/messages' endpoint
@api.route('/messages', methods=['POST'])
class MessagesResource(Resource):
        
    # Create a new message
    @api.marshal_with(message_model)
    @api.expect(message_model)
    def post(self):
        data = request.get_json()

        new_message = Message(content=data.get('content'), message_number=data.get('message_number'), conversation_id=data.get('conversation_id'))

        new_message.save()

        return new_message, 201
    

# Define a resource for the '/messages/<int:conversation_id>' endpoint
@api.route('/messages/<int:conversation_id>', methods=['GET'])
class MessageResource(Resource):
    # Get a message by ID
    @api.marshal_list_with(message_model)
    def get(self, conversation_id):
        messages = Message.query.filter_by(conversation_id=conversation_id).all()

        return messages           

# Define a resource for the '/conversations' endpoint
@api.route('/conversations', methods=['POST'])
class ConversationsResource(Resource):
    # Create a new conversation
    @api.marshal_with(conversation_model)
    @api.expect(conversation_model)
    def post(self):
        data = request.get_json()

        new_conversation = Conversation(title=data.get('title'), image_path=data.get('image_path'), date_created=data.get('date_created'), summary=data.get('summary'), account_id=data.get('account_id'))

        new_conversation.save()

        return new_conversation, 201
    
# Define a resource for the '/conversations/<int:account_id>' endpoint
@api.route('/conversations/<int:account_id>', methods=['GET'])
class ConversationResource(Resource):
    # Get all conversations by ID
    @api.marshal_list_with(conversation_model)
    def get(self, account_id):
        conversation = Conversation.query.filter_by(account_id=account_id).all()

        return conversation    
    
# Define a resource for the '/api_keys' endpoint
@api.route('/api_keys', methods=['POST'])
class APIKeysResource(Resource):
    # Create a new API key
    @api.marshal_with(api_key_model)
    @api.expect(api_key_model)
    def post(self):
        data = request.get_json()

        new_api_key = APIKey(api_key=data.get('api_key'), account_id=data.get('account_id'))

        new_api_key.save()

        return new_api_key, 201
    
# Define a resource for the '/api_keys/<int:account_id>' endpoint
@api.route('/api_keys/<int:account_id>', methods=['GET', 'DELETE'])
class APIKeyResource(Resource):
    # Get an API key by ID
    @api.marshal_with(api_key_model)
    def get(self, account_id):
        api_key = APIKey.query.get(account_id)

        return api_key
    
    # Delete an API key by ID
    def delete(self, account_id):
        api_key = APIKey.query.get(account_id)

        api_key.delete()

        return {'message': 'API key deleted successfully'}, 200

@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'Message': Message}
    
# Run the Flask application if this file is executed directly
if __name__ == '__main__':
    app.run()