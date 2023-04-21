from flask import Blueprint

care_api = Blueprint('care_api', __name__, url_prefix='/care')

from . import models
from . import routes
