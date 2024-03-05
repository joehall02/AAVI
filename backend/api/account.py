from flask_restx import Namespace, Resource, fields
from models import Account
from flask_jwt_extended import jwt_required
from flask import Flask, request

# Define namespace for the account operations
accounts_ns = Namespace('account', description='Account operations')


# Define a model for the Account resource, this is used to serialize the data
account_model = accounts_ns.model('Account', {
    'id': fields.Integer(),
    'name': fields.String(),
    'username': fields.String(),
    'email': fields.String(),
    'password': fields.String(),
    'role': fields.String()    
})

# Define a resource for the '/accounts/<int:account_id>' endpoint
@accounts_ns.route('/accounts/<int:account_id>', methods=['GET', 'PUT', 'DELETE'])
class AccountResource(Resource):
    @accounts_ns.marshal_with(account_model)
    @jwt_required() # Protect this endpoint with JWT
    def get(self, account_id):
        account = Account.query.get(account_id)
        
        return account
    
    @accounts_ns.marshal_with(account_model)
    @accounts_ns.expect(account_model)
    @jwt_required() # Protect this endpoint with JWT
    def put(self, account_id):
        account = Account.query.get(account_id)
        data = request.get_json()
        
        account.username = data.get('username')
        account.password = data.get('password')
        
        account.save()
        
        return account
        
    @jwt_required() # Protect this endpoint with JWT
    def delete(self, account_id):
        account = Account.query.get(account_id)
        
        account.delete()
        
        return {'message': 'Account deleted successfully'}, 200
        
    
