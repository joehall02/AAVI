import os
from flask_restx import Namespace, Resource, fields
from models import Conversation
from flask_jwt_extended import jwt_required
from flask import Flask, request, current_app
from werkzeug.utils import secure_filename

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

# Define a resource for the '/upload' endpoint
@image_analysis_ns.route('/upload', methods=['POST'])
class UploadResource(Resource):
    
    #@jwt_required() # Protect this endpoint with JWT
    def post(self):
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
        
        # If the file is valid, save it to the upload folder
        if file:
            filename = secure_filename(file.filename) # Secure the filename

            # Generate a unique filename to avoid overwriting existing images
            unique_filename = generate_unique_filename(filename)
            file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], unique_filename))
            return {'message': 'File uploaded successfully'}, 201

        
        
