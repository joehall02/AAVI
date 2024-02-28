from exts import db


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