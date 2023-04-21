import os
import base64
from datetime import datetime, timedelta
from app import db
from werkzeug.security import generate_password_hash, check_password_hash


class Elder(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    
    email = db.Column(db.String(100), nullable=False, unique=True)
    phone = db.Column(db.String(50), nullable=False, unique=True)
    address = db.Column(db.String(100), nullable=False)
    birthday = db.Column(db.Date, nullable=False)

    password = db.Column(db.String(256), nullable=False)
    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    token = db.Column(db.String(32), unique=True, index=True)
    token_expiration = db.Column(db.DateTime)
    # posts = db.relationship('Post', backref='author', lazy=True)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.password = generate_password_hash(kwargs['password'])
        self.birthday = datetime.strptime(kwargs['birthday'], "%Y-%m-%d").date()
        db.session.add(self)
        db.session.commit()

    def __repr__(self):
        return f"<Elder|{self.first_name} {self.last_name}>"

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'birthday': self.birthday,
            'date_created': self.date_created
        }

    def get_token(self, expires_in=3600):
        now = datetime.utcnow()
        if self.token and self.token_expiration > now + timedelta(minutes=1):
            return self.token
        self.token = base64.b64encode(os.urandom(24)).decode('utf-8')
        self.token_expiration = now + timedelta(seconds=expires_in)
        db.session.commit()
        return self.token

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, data):
        for field in data:
            if field not in {'phone', 'email', 'address', 'birthday', 'password', 'first_name', 'last_name'}:
                continue
            if field == 'password':
                setattr(self, field, generate_password_hash(data[field]))
            else:
                setattr(self, field, data[field])
        db.session.commit()


class ServiceRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    price = db.Column(db.Integer)   # actual price
    service_time = db.Column(db.DateTime)  # date and time
    status = db.Column(db.Integer, nullable=False)

    service_remark = db.Column(db.String(100))
    rating = db.Column(db.Integer)
    comment = db.Column(db.String(100))

    date_created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    elder_id = db.Column(db.Integer, db.ForeignKey('elder.id'), nullable=False)
    sid = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=False)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        db.session.add(self)
        db.session.commit()

    def to_dict(self, ServiceModel):
        service_time = (None, None)
        if self.service_time:
            service_time = (self.service_time.strftime("%a, %m %d %Y"),
                self.service_time.strftime("%H:%M:%S"))

        return {
            'id': self.id,
            'price': self.price,
            'service_time': service_time,

            'status': self.status,
            'service_remark': self.service_remark,
            'rating': self.rating,
            'comment': self.comment,

            'date_created': (
                self.date_created.strftime("%a, %m %d %Y"),
                self.date_created.strftime("%H:%M:%S")),

            'elder': Elder.query.get(self.elder_id).to_dict(),
            'service': ServiceModel.query.get(self.sid).to_dict()
        }

    def update(self, data):
        for field in data:
            if field not in {'price', 'service_time', 'status', 'service_remark', 'rating', 'comment'}:
                continue
            if field == 'service_time':
                service_time = datetime.strptime(data['service_time'], "%Y-%m-%d %H:%M:%S")
                setattr(self, field, service_time)
            else:
                setattr(self, field, data[field])
        db.session.commit()