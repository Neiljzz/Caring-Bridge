from flask import jsonify, request
from app.blueprints.elder import elder_api
from app.blueprints.elder.models import Elder, ServiceRecord
from app.blueprints.caregiver.models import Caregiver, Service, ServiceType
from app.blueprints.elder.http_auth import basic_auth, token_auth


# Create a user
@elder_api.route('/sign_up', methods=['POST'])
def create_elder():
    data = request.json
    # Validate the data
    for field in ['phone', 'email', 'address', 'birthday',  'password', 'first_name', 'last_name']:
        if field not in data:
            return jsonify({'error': f"You are missing the {field} field"}), 400

    # Grab the data from the request body
    email = data['email']
    phone = data['phone']

    # Check if the username or email already exists
    elder_exists = Elder.query.filter((Elder.phone == phone)|(Elder.email == email)).all()
    # if it is, return back to register
    if elder_exists:
        return jsonify({'error': f"Elder with phone {phone} or email {email} already exists"}), 400

    # Create the new user
    # new_user = User(username=username, email=email, password=password)
    new_elder = Elder(**data)


    return jsonify(new_elder.to_dict())


@elder_api.route('/token', methods=['POST'])
@basic_auth.login_required
def get_token():
    user = basic_auth.current_user()
    token = user.get_token()

    return jsonify({'token': token, "kind": "elder"})


# Update a user by id
@elder_api.route('/<int:id>/update', methods=['PUT'])
@token_auth.login_required
def update_user(id):
    current_user = token_auth.current_user()
    if current_user.id != id:
        return jsonify({'error': 'You do not have access to update this user'}), 403
    user = Elder.query.get_or_404(id)
    data = request.json
    user.update(data)
    return jsonify(user.to_dict())


# Get user info from token
@elder_api.route('/me')
@token_auth.login_required
def me():
    return token_auth.current_user().to_dict()


# Get all posts
@elder_api.route('/services')
def search_services():
    args = request.args
    cname = args.get('cname')
    st_id = args.get('stid')

    query = Service.query.join(Caregiver, Service.caregiver_id == Caregiver.id)

    if cname:
        query = query.filter(
            (Caregiver.first_name.like("%"+cname+"%") | Caregiver.last_name.like("%"+cname+"%"))
        )

    if st_id:
        query = query.filter(
            (Service.st_id == st_id)
        )

    services = query.all()
    return jsonify([s.to_dict() for s in services])


@elder_api.route('/buy_service/<int:sid>')
@token_auth.login_required
def buy_service(sid):
    current_user = token_auth.current_user()
    service = Service.query.get_or_404(sid)
    service_record = ServiceRecord.query.filter(
        (ServiceRecord.sid==service.id) & (ServiceRecord.elder_id==current_user.id) & (ServiceRecord.status==0)
    ).first()
    if not service_record:
        service_record = ServiceRecord(status=0, elder_id=current_user.id, sid=sid)
    return jsonify(service_record.to_dict(Service))


@elder_api.route('/service_records')
@token_auth.login_required
def search_service_records():
    current_user = token_auth.current_user()
    args = request.args
    status = args.get('status')

    query = ServiceRecord.query.filter((ServiceRecord.elder_id==current_user.id))
    if status and status.isdigit():
        status = int(status)
        query = query.filter(
            (ServiceRecord.status == status)
        )

    service_records = query.order_by(ServiceRecord.date_created.desc()).all()

    return jsonify([sr.to_dict(Service) for sr in service_records])


@elder_api.route('/service_record/<int:sr_id>', methods=['DELETE'])
@token_auth.login_required
def cancel_service_record(sr_id):
    current_user = token_auth.current_user()
    service_record = ServiceRecord.query.get_or_404(sr_id)

    srd = service_record.to_dict(Service)
    if srd['elder']['id'] != current_user.id:
        return jsonify({'error': 'You are not allowed to edit this service record'}), 403

    if srd['status'] != 1:
        return jsonify({'error': 'Invalid status to cancel'}), 400

    service_record.update({"status": 3})

    return jsonify({'success': 'cancel ok'})


@elder_api.route('/service_record/<int:sr_id>', methods=['PUT'])
@token_auth.login_required
def review_service_record(sr_id):
    current_user = token_auth.current_user()
    service_record = ServiceRecord.query.get_or_404(sr_id)

    srd = service_record.to_dict(Service)
    if srd['elder']['id'] != current_user.id:
        return jsonify({'error': 'You are not allowed to edit this service record'}), 403

    if srd['status'] != 5:
        return jsonify({'error': 'Invalid status to cancel'}), 400

    data = request.json
    to_update = {}
    for field in ["rating", "comment"]:
        if field not in data:
            return jsonify({'error': f'Post body miss data: {field}'}), 400

        to_update[field] = data[field]

    to_update['status'] = 6
    service_record.update(to_update)
    return jsonify({'success': 'review ok'})