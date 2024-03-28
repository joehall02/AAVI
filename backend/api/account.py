from flask_restx import Namespace, Resource, fields
from models import Account, APIKey
from flask_jwt_extended import jwt_required
from flask import Flask, abort, jsonify, request
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
    'role': fields.String(),       
    'api_key': fields.String()   
})

partial_account_model = account_ns.model('Partial Account', {
    'id': fields.Integer(),
    'username': fields.String(),
    'name': fields.String()
})

api_key_model = account_ns.model('API Key', {
    'api_key': fields.String(),
    'account_id': fields.Integer()
})


# Define a resource for the '<int:account_id>' endpoint
@account_ns.route('/<int:account_id>', methods=['GET', 'POST', 'DELETE'])
class AccountResource(Resource):
    # Get an account by ID and return the account's username, password, and API key
    # Used to get account details in account page
    @account_ns.marshal_with(partial_account_model)
    #@jwt_required() # Protect this endpoint with JWT
    def get(self, account_id):
        db_account = Account.query.get(account_id)

        if db_account is None:
            abort(404, 'Account not found')

            
        return db_account
    
    # Create a new API key for the account
    # Used to add a new API key in account page
    @account_ns.marshal_with(api_key_model)
    #@jwt_required() # Protect this endpoint with JWT
    def post(self, account_id):

        db_api_key = APIKey.query.filter_by(account_id=account_id).first()

        if db_api_key is not None:
            return {'message': 'API Key already exists'}, 400

        data = request.get_json()

        new_api_key = APIKey(api_key=data.get('api_key'), account_id=data.get('account_id'))

        new_api_key.save()

        return new_api_key, 201

        
    # Delete an account by ID
    # Used to delete account in account page
    #@jwt_required() # Protect this endpoint with JWT
    def delete(self, account_id):
        account = Account.query.get(account_id)

        account.delete()
        
        return {'message': 'Account deleted successfully'}, 200
        
    
# Define a resource for the '/username/<int:account_id>' endpoint
@account_ns.route('/username/<int:account_id>', methods=['PUT'])
class AccountResource(Resource):
    
    # Update account details (Username) by ID
    @account_ns.expect(account_model)
    def put(self, account_id):
        db_account = Account.query.get(account_id)
        
        data = request.get_json()

        # Check if the account with the username already exists
        username = data.get('username')

        db_user = Account.query.filter_by(username=username).first()

        if db_user is not None:
            return {'message': f'Username {username} already exists'}, 400

        
        db_account.username = data.get('username')
        
        db_account.save()
        
        return {'message': 'Username updated successfully'}, 200


        
# Define a resource for the '/name/<int:account_id>' endpoint
@account_ns.route('/name/<int:account_id>', methods=['PUT'])
class AccountResource(Resource):
    
    # Update account details (name) by ID
    @account_ns.marshal_with(account_model)
    @account_ns.expect(account_model)
    def put(self, account_id):
        db_account = Account.query.get(account_id)
        data = request.get_json()
        
        db_account.name = data.get('name')
        
        db_account.save()
        
        return {'message': 'Name updated successfully'}, 200

    
# Define a resource for the '/password/<int:account_id>' endpoint
@account_ns.route('/password/<int:account_id>', methods=['PUT'])
class AccountResource(Resource):
    
    # Update account details (password) by ID
    @account_ns.marshal_with(account_model)
    @account_ns.expect(account_model)
    def put(self, account_id):
        db_account = Account.query.get(account_id)
        data = request.get_json()
        
        db_account.password = generate_password_hash(data.get('password')) # Hash the password
        
        db_account.save()
        
        return {'message': 'Password updated successfully'}, 200

# Define a resource for the '/api_key/<int:account_id>' endpoint
@account_ns.route('/api_key/<int:account_id>', methods=['PUT'])
class AccountResource(Resource):
    
    # Update account details (password) by ID
    @account_ns.marshal_with(account_model)
    @account_ns.expect(account_model)
    def put(self, account_id):
        try:
            db_api_key = APIKey.query.filter_by(account_id=account_id).first()
        except :
            return {'message': 'API Key not found'}, 404

        data = request.get_json()
        
        db_api_key.api_key = data.get('api_key')
        
        db_api_key.save()
        
        return {'message': 'API Key updated successfully'}, 200

    
    
    
    