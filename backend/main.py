from flask import Flask
from flask_restx import Api, Resource
from config import DevConfig

app = Flask(__name__)

app.config.from_object(DevConfig)

api = Api(app, doc='/docs')

@api.route('/hello', methods=['GET'])
class HelloResource(Resource):
    def get(self):
        return {'message': 'world'}
    
if __name__ == '__main__':
    app.run()