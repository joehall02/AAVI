from flask import Flask, send_from_directory
from flask_restx import Namespace, Resource

audio_ns = Namespace('Audio', description='Audio operations')

# This file is used to serve audio from the audio folder

@audio_ns.route('/<path:filename>')
class AudioResource(Resource):
    def get(self, filename):
        return send_from_directory('../Audio', filename)