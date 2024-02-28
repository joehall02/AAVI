from flask import Flask
from flask_restx import Api, Resource
from config import DevConfig
from models import Message
from exts import db

# Create Flask application instance
app = Flask(__name__)

# Load configuration from DevConfig class
app.config.from_object(DevConfig)

# Initialize the database
db.init_app(app)

# Create Flask-RestX API instance
api = Api(app, doc='/docs')

# Define a resource for the '/hello' endpoint
@api.route('/hello', methods=['GET'])
class HelloResource(Resource):
    def get(self):
        return {'message': 'world'}
    

@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'Message': Message}
    
# Run the Flask application if this file is executed directly
if __name__ == '__main__':
    app.run()