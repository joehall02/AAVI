from flask_restx import Namespace, Resource, fields
from models import Message
from flask_jwt_extended import jwt_required
from flask import Flask, request

# Define a namespace for the message operations
messages_ns = Namespace('Gallery', description='Gallery operations')

# Define a model for the Message resource, this is used to serialize the data
message_model = messages_ns.model('Message', {
    'id': fields.Integer(),
    'content': fields.String(),
    'message_number': fields.Integer(),
    'conversation_id': fields.Integer()
})


# Define a resource for the '/messages' endpoint
@messages_ns.route('/messages', methods=['POST'])
class MessagesResource(Resource):
        
    # Create a new message
    @messages_ns.marshal_with(message_model)
    @messages_ns.expect(message_model)
    @jwt_required() # Protect this endpoint with JWT
    def post(self):
        data = request.get_json()

        new_message = Message(content=data.get('content'), message_number=data.get('message_number'), conversation_id=data.get('conversation_id'))

        new_message.save()

        return new_message, 201
    

# Define a resource for the '/messages/<int:conversation_id>' endpoint
@messages_ns.route('/messages/<int:conversation_id>', methods=['GET'])
class MessageResource(Resource):
    # Get a message by ID
    @messages_ns.marshal_list_with(message_model)
    @jwt_required() # Protect this endpoint with JWT
    def get(self, conversation_id):
        db_message = Message.query.filter_by(conversation_id=conversation_id).all()

        return db_message           