from flask import Flask, send_from_directory
from flask_restx import Namespace, Resource

images_ns = Namespace('Images', description='Image operations')

# This file is used to serve images from the Images folder

@images_ns.route('/<path:filename>')
class ImageResource(Resource):
    def get(self, filename):
        return send_from_directory('./Images', filename)