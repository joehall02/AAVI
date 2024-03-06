from exts import db
from datetime import date

# Account model        
class Account(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(60), nullable=False)
    username = db.Column(db.String(30), nullable=False, unique=True)
    email = db.Column(db.String(60), nullable=True) # Email set to null to allow admin to create accounts without email
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(13), nullable=False)

    # Relationship with API Key
    api_key = db.relationship('APIKey', backref='account', uselist=False, cascade="all, delete-orphan") # uselist=False to indicate that an account has only one API key. cascade="all, delete-orphan" to delete the API key when the account is deleted

    # Relationship with Conversation
    conversations = db.relationship('Conversation', backref='account', cascade="all, delete-orphan") # cascade="all, delete-orphan" to delete the conversations when the account is deleted

    def __repr__(self):
        return f"<Account(id={self.id}, username={self.username}, email={self.email})>"
    
    # Method to save the account to the database
    def save(self):
        db.session.add(self)
        db.session.commit()
    
    # Method to delete the account from the database
    def delete(self):
        db.session.delete(self)
        db.session.commit()

    # Method to update the account in the database
    def update(self, new_username, new_password):
        self.username = new_username
        self.password = new_password        
        db.session.commit()
    
# APIKey model
class APIKey(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    api_key = db.Column(db.String(50), nullable=False, unique=True)
    
    # Foreign key to Account
    account_id = db.Column(db.Integer(), db.ForeignKey('account.id', name='fk_api_key_account'), nullable=False)

    def __repr__(self):
        return f"<APIKey(id={self.id}, api_key={self.api_key})>"
    
    # Method to save the API key to the database
    def save(self):
        db.session.add(self)
        db.session.commit()
    
    # Method to delete the API key from the database
    def delete(self):
        db.session.delete(self)
        db.session.commit()
    
# Conversation model    
class Conversation(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    image_path = db.Column(db.String(100), nullable=False)
    date_created = db.Column(db.Date(), nullable=False, default=date.today())
    summary = db.Column(db.String(500), nullable=False)

    # Foreign key to Account
    account_id = db.Column(db.Integer(), db.ForeignKey('account.id', name='fk_conversation_account'), nullable=False)

    # Relationship with Message
    messages = db.relationship('Message', backref='conversation')

    def __repr__(self):
        return f"<Conversation(id={self.id}, title={self.title}, date_created={self.date_created})>"
    
    # Method to save the conversation to the database
    def save(self):
        db.session.add(self)
        db.session.commit()                

# Message model
class Message(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    content = db.Column(db.String(300), nullable=False)
    message_number = db.Column(db.Integer(), nullable=False)

    # Foreign key to Conversation
    conversation_id = db.Column(db.Integer(), db.ForeignKey('conversation.id', name='fk_message_conversation'), nullable=False)

    def __repr__(self):
        return f"<Message(id={self.id}, content={self.content}, message_number={self.message_number}, conversation_id={self.conversation_id})>"
    
    # Method to save the message to the database
    def save(self):
        db.session.add(self)
        db.session.commit()    

"""# Message model
class Message(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    content = db.Column(db.String(), nullable=False)

    def __repr__(self):
        return f"<Message(id={self.id}, content={self.content})>"
    
    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
    
    def update(self, new_content):
        self.content = new_content
        db.session.commit()

# User model
class User(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    email = db.Column(db.String(60), nullable=False, unique=True)
    password = db.Column(db.String(), nullable=False)

    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, email={self.email})>"
        
        
"""