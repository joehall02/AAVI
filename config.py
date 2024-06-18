# Importing necessary modules
from decouple import config
import os

# Getting the base directory path
BASE_DIR = os.path.dirname(os.path.realpath(__file__))

# Creating a configuration class
class Config:
    # Setting the secret key and track modifications
    SECRET_KEY = config('SECRET_KEY')
    SQLALCHEMY_TRACK_MODIFICATIONS = config('SQLALCHEMY_TRACK_MODIFICATIONS', cast=bool)

# Creating a development configuration class
class DevConfig(Config):
    # Setting the database URI for development
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(BASE_DIR, 'dev.db')
    DEBUG = True
    SQLALCHEMY_ECHO = True

# Creating a production configuration class
class ProdConfig(Config):
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(BASE_DIR, 'dev.db')
    DEBUG = config('DEBUG', cast=bool)
    SQLALCHEMY_ECHO = config('ECHO')
    SQLALCHEMY_TRACK_MODIFICATIONS = config('SQLALCHEMY_TRACK_MODIFICATIONS', cast=bool)

# Creating a test configuration class
class TestConfig(Config):
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(BASE_DIR, 'test.db')
    SQLALCHEMY_ECHO = False
    TESTING = True