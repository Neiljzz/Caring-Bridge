from datetime import datetime
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from app.blueprints.caregiver.models import Caregiver

basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth()


@basic_auth.verify_password
def verify(email, password):
    print("verify", email, password)
    user = Caregiver.query.filter_by(email=email).first()
    if user and user.check_password(password):
        return user


@basic_auth.error_handler
def handle_error(status_code):
    print(status_code)
    return {'error': 'Incorrect email and/or password'}


@token_auth.verify_token
def verify(token):
    user = Caregiver.query.filter_by(token=token).first()
    if user and user.token_expiration > datetime.utcnow():
        return user


@token_auth.error_handler
def handle_error(status_code):
    print(status_code)
    return {'error': 'You must be authenticated to perform this action'}
