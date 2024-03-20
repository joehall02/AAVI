import os
import requests
import base64

from flask_restx import Namespace, Resource, fields
from models import Conversation, Account
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

# Define a resource for the '/upload' endpoint
@image_analysis_ns.route('/upload/<int:account_id>', methods=['POST'])
class UploadResource(Resource):
    
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
            client = OpenAI(api_key="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")

            # Get the base64 encoded image
            encoded_image = encode_image(image_path)

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
            ai_response = response.choices[0].message.content.strip()
            
            # Create a new conversation with the image details
            new_conversation = Conversation(title=filename, image_path=image_path, summary=ai_response, account_id=account_id)

            # Save the conversation to the database
            new_conversation.save()



            return {'message': 'Image uploaded and analyzed successfully', 'conversation': f'{new_conversation.summary}'}, 201
        


        
        
