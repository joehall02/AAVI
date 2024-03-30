from flask_restx import Namespace, Resource, fields
from models import Account
from flask_jwt_extended import jwt_required
from flask import Flask, request
from werkzeug.security import generate_password_hash

# Define namespace for the account operations
admin_settings_ns = Namespace('Admin Settings', description='Admin settings operations')

# Define a model for the Account resource, this is used to serialize the data
get_account_model = admin_settings_ns.model('Account', {
    'id': fields.Integer(),
    'name': fields.String(),
    'username': fields.String(),
    'role': fields.String()
})

post_account_model = admin_settings_ns.model('Account', {
    'name': fields.String(),
    'username': fields.String(),
    'password': fields.String(),
    'role': fields.String()
})

# Define a resource for the '/admin_settings' endpoint
# Used to get all accounts on admin settings page
@admin_settings_ns.route('/', methods=['GET', 'POST', 'DELETE']) 
class AdminSettingsResource(Resource):
    @admin_settings_ns.marshal_list_with(get_account_model)
    #@jwt_required() # Protect this endpoint with JWT
    def get(self):
        accounts = Account.query.all()
        
        return accounts
    
    @admin_settings_ns.expect(post_account_model)
    #@jwt_required() # Protect this endpoint with JWT
    def post(self):
        data = request.get_json()
        
        # Check if the account with the username already exists
        username = data.get('username')

        db_user = Account.query.filter_by(username=username).first()

        if db_user is not None:
            return {'message': f'Username {username} already exists'}, 400
            

        # Create a new account if the username does not exist
        new_account = Account(name=data.get('name'), username=data.get('username'), password=generate_password_hash(data.get('password')), role=data.get('role'))
        
        new_account.save()
        
        return {'message': 'Account created successfully'}, 201
    
# Define a resource for the '/admin_settings/<string:username>' endpoint
# Used to get a specific account on admin settings page when entered in the search bar
@admin_settings_ns.route('/<string:username>', methods=['GET'])
class AdminSettingResource(Resource):
    @admin_settings_ns.marshal_with(get_account_model)
    #@jwt_required() # Protect this endpoint with JWT
    def get(self, username):
        account = Account.query.filter_by(username=username).first()
        
        return account
    

# Define a resource for the '/admin_settings/<int:account_id>' endpoint
# Used to delete a specific account on admin settings page
@admin_settings_ns.route('/<int:account_id>', methods=['DELETE'])
class AdminSettingResource(Resource):
    #@jwt_required() # Protect this endpoint with JWT
    def delete(self, account_id):
        account = Account.query.get(account_id)

        # Check if the account exists
        if account is None:
            return {'message': 'Account not found'}, 404
        
        account.delete()
        
        return {'message': 'Account deleted successfully'}, 200