from flask_restx import Namespace, Resource, fields
from models import Account, APIKey
from flask_jwt_extended import jwt_required
from flask import Flask, request
from werkzeug.security import generate_password_hash

# Define namespace for the account operations
account_ns = Namespace('Account', description='Account operations')


# Define a model for the Account resource, this is used to serialize the data
account_model = account_ns.model('Account', {
    'id': fields.Integer(),
    'name': fields.String(),
    'username': fields.String(),
    'email': fields.String(),
    'password': fields.String(),
    'role': fields.String()    
})

partial_account_model = account_ns.model('Partial Account', {
    'username': fields.String(),
    'password': fields.String(),
    'api_key': fields.String()
})

api_key_model = account_ns.model('API Key', {
    'api_key': fields.String(),
    'account_id': fields.Integer()
})

# Define a resource for the '/accounts/<int:account_id>' endpoint
@account_ns.route('/account/<int:account_id>', methods=['GET', 'PUT', 'POST', 'DELETE'])
class AccountResource(Resource):
    # Get an account by ID and return the account's username, password, and API key
    # Used to get account details in account page
    @account_ns.marshal_with(partial_account_model)
    #@jwt_required() # Protect this endpoint with JWT
    def get(self, account_id):
        db_account = Account.query.get(account_id)

        return db_account
    
    # Create a new API key for the account
    # Used to add a new API key in account page
    @account_ns.marshal_with(api_key_model)
    #@jwt_required() # Protect this endpoint with JWT
    def post(self, account_id):
        data = request.get_json()

        new_api_key = APIKey(api_key=data.get('api_key'), account_id=data.get('account_id'))

        new_api_key.save()

        return new_api_key, 201

    
    # Update account details (Username, Password, API Key) by ID
    # Used to edit account details in account page
    @account_ns.marshal_with(partial_account_model)
    @account_ns.expect(partial_account_model)
    #@jwt_required() # Protect this endpoint with JWT
    def put(self, account_id):
        db_account = Account.query.get(account_id)
        data = request.get_json()
        
        db_account.username = data.get('username')
        db_account.password = generate_password_hash(data.get('password')) # Hash the password
        db_account.api_key.api_key = data.get('api_key')
        
        db_account.save()
        
        return db_account
        
    # Delete an account by ID
    # Used to delete account in account page
    #@jwt_required() # Protect this endpoint with JWT
    def delete(self, account_id):
        account = Account.query.get(account_id)
        
        # Get the API key associated with the account
        #api_key = account.api_key

        # Get list of all conversations associated with the account


        account.delete()
        
        return {'message': 'Account deleted successfully'}, 200
        
    
