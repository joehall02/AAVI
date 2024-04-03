from flask_restx import Namespace, Resource, fields
from models import Conversation, Message
from flask_jwt_extended import jwt_required
from flask import Flask, request

# Define a namespace for the Gallery operations
gallery_ns = Namespace('Gallery', description='Gallery operations')

# Define a model for the Message resource, this is used to serialize the data
partial_conversations_model = gallery_ns.model('Conversation', {
    'id': fields.Integer(),
    'title': fields.String(),
    'image_path': fields.String()
})

# Define a model for the Message resource
message_model = gallery_ns.model('Message', {
    'id': fields.Integer(),
    'content': fields.String(),
    'message_number': fields.Integer(),
    'tts_audio_path': fields.String(),
    'conversation_id': fields.Integer(),
    'type': fields.String()
})

# Define a model for the Conversation resource, this is used to serialize the data
conversation_model = gallery_ns.model('Conversation', {
    'id': fields.Integer(),
    'title': fields.String(),
    'image_path': fields.String(),
    'date_created': fields.Date(),
    'summary': fields.String(),
    'tts_audio_path': fields.String(),
    'account_id': fields.Integer(),
    'messages': fields.List(fields.Nested(message_model))
})


# Define a resource for the '/int:account_id' endpoint
@gallery_ns.route('/<int:account_id>', methods=['GET'])
class GalleryResource(Resource):
    # Get all conversations by ID
    @gallery_ns.marshal_list_with(partial_conversations_model)
    #@jwt_required() # Protect this endpoint with JWT
    def get(self, account_id):
        conversations = Conversation.query.filter_by(account_id=account_id).all()

        return conversations

# Define a resource for the '/conversation/int:conversation_id' endpoint
# Used to get the full conversation details by ID
@gallery_ns.route('/conversation/<int:conversation_id>', methods=['GET'])
class ConversationResource(Resource):
    # Get a conversation by ID
    @gallery_ns.marshal_with(conversation_model)
    #@jwt_required() # Protect this endpoint with JWT
    def get(self, conversation_id):
        conversation = Conversation.query.get(conversation_id)
        messages = Message.query.filter_by(conversation_id=conversation_id).all()

        conversation.messages = messages


        return conversation
    

@gallery_ns.route('/conversation/hello', methods=['GET'])
class ConversationResource(Resource):

    #@jwt_required() # Protect this endpoint with JWT
    def get(self):


        return {'message': 'Hello World!'}