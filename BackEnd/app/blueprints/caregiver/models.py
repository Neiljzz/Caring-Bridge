import os
import base64
from datetime import datetime, timedelta
from app import db
from werkzeug.security import generate_password_hash, check_password_hash


def calculate_age(born):
    today = datetime.today()
    return today.year - born.year - ((today.month, today.day) < (born.month, born.day))

class Caregiver(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)

    email = db.Column(db.String(100), nullable=False, unique=True)
    phone = db.Column(db.String(50), nullable=False, unique=True)
    address = db.Column(db.String(100), nullable=False)
    birthday = db.Column(db.Date, nullable=False)
    intro = db.Column(db.Text, nullable=False)

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
        return f"<Caregiver|{self.first_name} {self.last_name}>"

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
            'intro': self.intro,
            'birthday': self.birthday.strftime("%Y/%m/%d"),
            'age': calculate_age(self.birthday),
            'date_created': self.date_created,
            'image': "/static/images/%s.jpeg" % ((self.id-1) % 4)
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
            if field not in {'phone', 'email', 'address', 'birthday', 'intro'
                             'password', 'first_name', 'last_name'}:
                continue
            if field == 'password':
                setattr(self, field, generate_password_hash(data[field]))
            else:
                setattr(self, field, data[field])
        db.session.commit()


class ServiceType(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    kind = db.Column(db.String(50), nullable=False)
    sub_type = db.Column(db.String(50), nullable=False)
    desc = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'kind': self.kind,
            'sub_type': self.sub_type,
            'desc': self.desc
        }


class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    price = db.Column(db.Integer, nullable=False)
    duration = db.Column(db.Integer, nullable=False) # minute
    remarks = db.Column(db.String(255))
    is_delete = db.Column(db.Boolean, default=False, nullable=False)

    caregiver_id = db.Column(db.Integer, db.ForeignKey('caregiver.id'), nullable=False)
    st_id = db.Column(db.Integer, db.ForeignKey('service_type.id'), nullable=False)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        db.session.add(self)
        db.session.commit()

    def to_dict(self):
        return {
            'id': self.id,
            'price': self.price,
            'duration': self.duration,
            'remarks': self.remarks,
            'caregiver': Caregiver.query.get(self.caregiver_id).to_dict(),
            'service_type': ServiceType.query.get(self.st_id).to_dict()
        }

    def update(self, data):
        for field in data:
            if field not in {'price', 'duration', 'remarks'}:
                continue
            else:
                setattr(self, field, data[field])
        db.session.commit()

    def delete(self):
        setattr(self, "is_delete", True)
        db.session.commit()