from flask import Flask, request
from flask_restx import Api, Resource, fields
from config import DevConfig
from models import Message
from exts import db
from flask_migrate import Migrate

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

# Define a model for the Message resource that allows us to serialize and deserialize data
message_model = api.model('Message', {
    'id': fields.Integer(),
    'content': fields.String()
})

# Define a resource for the '/hello' endpoint
@api.route('/hello', methods=['GET'])
class HelloResource(Resource):
    def get(self):
        return {'message': 'world'}
    
# Define a resource for the '/messages' endpoint
@api.route('/messages', methods=['GET', 'POST'])
class MessagesResource(Resource):
    
    # Get all messages
    @api.marshal_list_with(message_model)
    def get(self):
        messages = Message.query.all()
        
        return messages

    # Create a new message
    @api.marshal_with(message_model)
    def post(self):
        data = request.get_json()

        new_message = Message(content=data.get('content'))

        new_message.save()

        return new_message, 201
    

# Define a resource for the '/messages/<int:id>' endpoint
@api.route('/messages/<int:id>', methods=['GET', 'PUT', 'DELETE'])
class MessageResource(Resource):
    # Get a message by ID
    @api.marshal_with(message_model)
    def get(self, id):
        message = Message.query.get_or_404(id)

        return message        

    # Update a message by ID
    @api.marshal_with(message_model)
    def put(self, id):
        message_to_update = Message.query.get_or_404(id)

        data = request.get_json()

        message_to_update.update(data.get('content'))

        return message_to_update

    # Delete a message by ID
    @api.marshal_with(message_model)
    def delete(self, id):
        message_to_delete = Message.query.get_or_404(id)

        message_to_delete.delete()

        return message_to_delete

@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'Message': Message}
    
# Run the Flask application if this file is executed directly
if __name__ == '__main__':
    app.run()