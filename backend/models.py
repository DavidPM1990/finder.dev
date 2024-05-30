from database import db
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime

class User(db.Model):
    __tablename__ = 'user'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    programming_language = db.Column(db.String(120), nullable=False)
    location = db.Column(JSONB, nullable=False)
    projects = db.relationship('Project', backref='user', lazy=True)
    liked_users = db.relationship('Like', foreign_keys='Like.user_id', backref='liking_user', lazy=True)
    likes_received = db.relationship('Like', foreign_keys='Like.liked_user_id', backref='liked_user', lazy=True)
    matches = db.relationship('Match', foreign_keys='Match.user_id', backref='matched_user', lazy=True)
    notifications = db.relationship('Notification', backref='user', lazy=True)
    avatar_url = db.Column(db.String(1000), unique=False, default='default_avatar_url.jpg')
    description = db.Column(db.Text())

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'programming_language': self.programming_language,
            'location': self.location,
            'projects': [project.serialize() for project in self.projects],
            'liked_users': [like.serialize() for like in self.liked_users],
            'likes_received': [like.serialize() for like in self.likes_received],
            'matches': [match.serialize() for match in self.matches],
            'notifications': [notification.serialize() for notification in self.notifications],
            'avatar_url': self.avatar_url,
            'description': self.description
        }

class Project(db.Model):
    __tablename__ = 'project'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    url = db.Column(db.String(256), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f"<Project {self.name}>"

class Like(db.Model):
    __tablename__ = 'like'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    liked_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'liked_user_id': self.liked_user_id,
            'timestamp': self.timestamp
            # Agrega más campos si es necesario
        }

class Match(db.Model):
    __tablename__ = 'match'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    matched_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<Match {self.user_id} <-> {self.matched_user_id}>"

class Notification(db.Model):
    __tablename__ = 'notification'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.String(256), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    read = db.Column(db.Boolean, default=False, nullable=False)

    def __repr__(self):
        return f"<Notification {self.message}>"
