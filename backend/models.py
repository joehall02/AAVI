from exts import db

# Message model
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