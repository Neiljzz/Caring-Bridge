from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config

app = Flask(__name__,
            static_url_path='/static',
            static_folder='./static')
app.config.from_object(Config)

CORS(app)

db = SQLAlchemy(app)
migrate = Migrate(app, db)

from app.blueprints.elder import elder_api
app.register_blueprint(elder_api)

from app.blueprints.caregiver import care_api
app.register_blueprint(care_api)



@app.route('/')
def index():
    return 'Flask API'