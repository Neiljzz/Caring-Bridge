from flask import Blueprint

elder_api = Blueprint('elder_api', __name__, url_prefix='/elder')

from . import models
from . import routes
