from flask_restx import Namespace, Resource, fields
from models import APIKey
from flask_jwt_extended import jwt_required
from flask import Flask, request

# Define a namespace for the message operations
api_key_ns = Namespace('Api Key', description='API Key operations')

# Define a model for the Message resource, this is used to serialize the data
api_key_model = api_key_ns.model('APIKey', {
    'id': fields.Integer(),
    'api_key': fields.String(),
    'account_id': fields.Integer()
})


# Define a resource for the '/api_keys' endpoint
@api_key_ns.route('/api_keys', methods=['POST'])
class APIKeysResource(Resource):
    # Create a new API key
    @api_key_ns.marshal_with(api_key_model)
    @api_key_ns.expect(api_key_model)
    @jwt_required() # Protect this endpoint with JWT
    def post(self):
        data = request.get_json()

        new_api_key = APIKey(api_key=data.get('api_key'), account_id=data.get('account_id'))

        new_api_key.save()

        return new_api_key, 201
    
# Define a resource for the '/api_keys/<int:account_id>' endpoint
@api_key_ns.route('/api_keys/<int:account_id>', methods=['GET', 'DELETE'])
class APIKeyResource(Resource):
    # Get an API key by ID
    @api_key_ns.marshal_with(api_key_model)
    @jwt_required() # Protect this endpoint with JWT
    def get(self, account_id):
        api_key = APIKey.query.get(account_id)

        return api_key
    
    # Delete an API key by ID
    @jwt_required() # Protect this endpoint with JWT
    def delete(self, account_id):
        api_key = APIKey.query.get(account_id)

        api_key.delete()

        return {'message': 'API key deleted successfully'}, 200