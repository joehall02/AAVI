from flask_restx import Namespace, Resource, fields
from models import Conversation
from flask_jwt_extended import jwt_required
from flask import Flask, request

# Define a namespace for the conversation operations
conversations_ns = Namespace('Image Analysis', description='Image Analysis operations')

# Define a model for the Conversation resource, this is used to serialize the data
conversation_model = conversations_ns.model('Conversation', {
    'id': fields.Integer(),
    'title': fields.String(),
    'image_path': fields.String(),
    'date_created': fields.Date(),
    'summary': fields.String(),
    'account_id': fields.Integer()
})


# Define a resource for the '/conversations' endpoint
@conversations_ns.route('/conversations', methods=['POST'])
class ConversationsResource(Resource):
    # Create a new conversation
    @conversations_ns.marshal_with(conversation_model)
    @conversations_ns.expect(conversation_model)
    @jwt_required() # Protect this endpoint with JWT
    def post(self):
        data = request.get_json()

        new_conversation = Conversation(title=data.get('title'), image_path=data.get('image_path'), date_created=data.get('date_created'), summary=data.get('summary'), account_id=data.get('account_id'))

        new_conversation.save()

        return new_conversation, 201
    
# Define a resource for the '/conversations/<int:account_id>' endpoint
@conversations_ns.route('/conversations/<int:account_id>', methods=['GET'])
class ConversationResource(Resource):
    # Get all conversations by ID
    @conversations_ns.marshal_list_with(conversation_model)
    @jwt_required() # Protect this endpoint with JWT
    def get(self, account_id):
        conversation = Conversation.query.filter_by(account_id=account_id).all()

        return conversation    
    