from flask_restx import Namespace, Resource, fields
from models import Account
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required
from flask import Flask, request

# Define a namespace for the authentication operations
auth_ns = Namespace('auth', description='Authentication operations')


# Define a model for the Account resource, this is used to serialize the data
account_model = auth_ns.model('Account', {
    'id': fields.Integer(),
    'name': fields.String(),
    'username': fields.String(),
    'email': fields.String(),
    'password': fields.String(),
    'role': fields.String()    
})   

# Define a model for the Signup resource, this is used to serialize the data
signup_model = auth_ns.model('Signup', {
    'name': fields.String(),
    'username': fields.String(),
    'email': fields.String(),
    'password': fields.String()
})

# Define a model for the Login resource, this is used to serialize the data
login_model = auth_ns.model('Login', {
    'username': fields.String(),
    'password': fields.String()
})


# Define a resource for the '/signup' endpoint
@auth_ns.route('/signup', methods=['POST'])
class SignupResource(Resource):
    @auth_ns.expect(signup_model)
    def post(self):
        data = request.get_json()
        
        # Check if the account with the username already exists
        username = data.get('username')

        db_user = Account.query.filter_by(username=username).first()

        if db_user is not None:
            return {'message': f'Username {username} already exists'}, 400

        # Create a new account if the username does not exist
        new_account = Account(name=data.get('name'), username=data.get('username'), email=data.get('email'), password=generate_password_hash(data.get('password')), role=('User')) # set default role to 'User'. Password hashing is also done here
        
        new_account.save()
        
        return {'message': 'Account created successfully'}, 201
    

# Define a resource for the '/login' endpoint
@auth_ns.route('/login', methods=['POST'])
class LoginResource(Resource):
    @auth_ns.expect(login_model)
    def post(self):
        data = request.get_json()
        
        db_user = Account.query.filter_by(username=data.get('username')).first()
        
        # Check if the account with the username exists and the password is correct
        if db_user and check_password_hash(db_user.password, data.get('password')):

            # Create access and refresh tokens
            access_token = create_access_token(identity=db_user.username)
            refresh_token = create_refresh_token(identity=db_user.username)

            # Return the tokens
            return {'access _token': access_token, 'refresh_token': refresh_token}, 200
        else:
            return {'message': 'Invalid credentials'}, 401
 