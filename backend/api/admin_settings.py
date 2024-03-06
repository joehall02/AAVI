from flask_restx import Namespace, Resource, fields
from models import Account
from flask_jwt_extended import jwt_required
from flask import Flask, request

# Define namespace for the account operations
admin_settings_ns = Namespace('Admin Settings', description='Admin settings operations')

