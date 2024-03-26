import os
import requests
import base64

from flask_restx import Namespace, Resource, fields
from models import Conversation, Account, Message
from flask_jwt_extended import jwt_required
from flask import Flask, request, current_app
from werkzeug.utils import secure_filename
from openai import OpenAI

# Define a namespace for the image analysis operations
image_analysis_ns = Namespace('Image Analysis', description='Image Analysis operations')

# Define a model for the Conversation resource, this is used to serialize the data
conversation_model = image_analysis_ns.model('Conversation', {
    'id': fields.Integer(),
    'title': fields.String(),
    'image_path': fields.String(),
    'date_created': fields.Date(),
    'summary': fields.String(),
    'account_id': fields.Integer()
})

# Define a model for the Message resource, this is used to serialize the data
message_model = image_analysis_ns.model('Message', {
    'id': fields.Integer(),
    'content': fields.String(),
    'message_number': fields.Integer(),
    'type': fields.String(),
    'conversation_id': fields.Integer()
})

# Function to check if the file type is allowed
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

# Function to generate a unique filename
def generate_unique_filename(filename):
    # Check if the filename already exists in the upload folder
    if os.path.exists(os.path.join(current_app.config['UPLOAD_FOLDER'], filename)):
        # If it does, generate a unique filename by appending a number to the filename
        count = 1
        while os.path.exists(os.path.join(current_app.config['UPLOAD_FOLDER'], f"{count}_{filename}")):
            count += 1
        return f"{count}_{filename}"
    else:
        return filename
    
# Function to encode the image
def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')
  
# Function to create open ai client
def create_openai_client(user):
  return OpenAI(api_key=user.api_key.api_key)

# Function to analyse the image
def analyse_image(client, encoded_image):
    
    # Create a payload to send to the OpenAI API
    response = client.chat.completions.create(
        model="gpt-4-vision-preview",
        
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": ("What is in this image?")},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{encoded_image}" # Base64 encoded image
                        },
                    },
                ],
            },
        ],
        max_tokens=100,                    
    )

    # Get the response in text
    return response.choices[0].message.content.strip()

# Function to analyse the message
def analyse_message(client, encoded_image, messages):

     # Create a payload to send to the OpenAI API with the encoded image
    messages_request = [
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url", 
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{encoded_image}"
                    }
                }
            ]
        }
    ]

    # If message.type == 'User' it is a user message, if message.type == 'AI' it is an AI message
    # Add all the messages in the conversation, in the correct format to the payload 
    for message in messages:
        if message.type == 'User':
            messages_request.append({
                "role": "user",
                "content": [
                    {"type": "text", "text": message.content}
                ]
            })
        else:
            messages_request.append({
                "role": "assistant",
                "content": [
                    {"type": "text", "text": message.content}
                ]
            })

    # Create a payload to send to the OpenAI API
    response = client.chat.completions.create(
        model="gpt-4-vision-preview",
        messages=messages_request,
        max_tokens=100,                    
    )      

    return response.choices[0].message.content.strip()  

# Function to generate a title for the conversation
def generate_title(client, ai_response):

    # Post the image summary to the OpenAI API to create a title for the conversation
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",

        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": ("Create a 50 character, or less, title based on this image summary. Do not include quotation marks in your response.")},
                    {"type": "text", "text": (ai_response)}
                ]
            }
        ]
    )

    return response.choices[0].message.content.strip()

# Function to get the last message number
def get_last_message_number(conversation_id):
    # Get the last message number for the conversation
    last_message = Message.query.filter_by(conversation_id=conversation_id).order_by(Message.message_number.desc()).first()

    # If there is no message, set the message number to 1
    if last_message is None:
        message_number = 1
        
    # If there is a message, increment the message number by 1
    else:
        message_number = last_message.message_number + 1

    return message_number

# Define a resource for the '/upload' endpoint
@image_analysis_ns.route('/upload/<int:account_id>', methods=['POST'])
class ImageAnalysisResource(Resource):
    
    #@jwt_required() # Protect this endpoint with JWT
    def post(self, account_id):

        # Get the account from the database
        user = Account.query.get(account_id)     

        # if account does not have an API key, return an error
        if user.api_key is None:
            return {'message': 'Account does not have an API key'}, 400   

        # Check if the post request has the file part
        if 'photo' not in request.files:
            return {'message': 'No file part'}, 400
        
        # Get the file from the post request
        file = request.files['photo']

        # If the user does not select a file, the browser submits an empty part without a filename
        if file.filename == '':
            return {'message': 'No selected file'}, 400
        
        # If the file is valid, save it to the upload folder
        if file and not allowed_file(file.filename):
            return {'message': 'Invalid file type'}, 400
        
        # If the file is valid, save it to the upload folder and send it to the OpenAI API
        if file:
            filename = secure_filename(file.filename) # Secure the filename

            # Generate a unique filename to avoid overwriting existing images
            unique_filename = generate_unique_filename(filename)
            
            # image path 
            image_path = os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename)

            # Save the file to the upload folder
            file.save(image_path)

            # Create an OpenAI client using the user's API key
            client = create_openai_client(user)

            # Get the base64 encoded image
            encoded_image = encode_image(image_path)

            # Analyse the image
            ai_response = analyse_image(client, encoded_image)

            # Post the image summary to the OpenAI API to create a title for the conversation
            title = generate_title(client, ai_response)
            
            # Remove any quotation marks from the title
            title = title.replace('"', '')

            # Create a new conversation with the image details
            new_conversation = Conversation(title=title, image_path=image_path, summary=ai_response, account_id=account_id)

            # Save the conversation to the database
            new_conversation.save()

            return {'message': 'Image uploaded and analyzed successfully', 'conversation': f'{new_conversation.summary}'}, 201
        

# Define a resource for the '/scan_result' endpoint
@image_analysis_ns.route('/scan_result/<int:account_id>', methods=['GET'])
class ImageAnalysisResource(Resource):
    #@jwt_required() # Protect this endpoint with JWT
    @image_analysis_ns.marshal_with(conversation_model)
    def get(self, account_id):
        
        # Get account from database
        user = Account.query.get(account_id)

        # Get the latest conversation for the account
        conversation = Conversation.query.filter_by(account_id=account_id).order_by(Conversation.id.desc()).first()

        # If there is no conversation, return an error
        if conversation is None:
            return {'message': 'No conversations found'}, 404
        
        return conversation

        
# Define a resource for the '/message' endpoint
@image_analysis_ns.route('/message/<int:conversation_id>', methods=['POST', 'GET'])
class ImageAnalysisResource(Resource):
    #@jwt_required() # Protect this endpoint with JWT
    @image_analysis_ns.marshal_with(message_model)
    def post(self, conversation_id):
        data = request.get_json()

        last_message_number = get_last_message_number(conversation_id)

        # Create a new message with the content, message number and conversation ID
        new_message = Message(content=data.get('content'), message_number=last_message_number, type='User', conversation_id=conversation_id) 

        # Save the message to the database
        new_message.save()        

        # Get the conversation from the database
        conversation = Conversation.query.get(conversation_id)

        # Get the encoded image using the image path
        encoded_image = encode_image(conversation.image_path)

        # Create an OpenAI client using the user's API key
        client = create_openai_client(conversation.account)

        # Get all the messages for the conversation
        messages = Message.query.filter_by(conversation_id=conversation_id).order_by(Message.message_number).all()

        # Analyse the message
        ai_response = analyse_message(client, encoded_image, messages)

        # Create a new message with the AI response, message number and conversation ID
        ai_new_message = Message(content=ai_response, message_number=last_message_number + 1, type='AI', conversation_id=conversation_id)

        # Save the message to the database
        ai_new_message.save()

        return new_message, 201

    @image_analysis_ns.marshal_with(message_model)
    def get(self, conversation_id):
        
        # Get the latest AI message for the conversation
        ai_message = Message.query.filter_by(conversation_id=conversation_id, type='AI').order_by(Message.id.desc()).first()

        # If there is no message, return an error
        if ai_message is None:
            return {'message': 'No messages found'}, 404

        return ai_message 
        
