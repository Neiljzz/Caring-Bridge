from flask import jsonify, request
from app.blueprints.caregiver import care_api
from app.blueprints.caregiver.models import Caregiver, ServiceType, Service
from app.blueprints.elder.models import ServiceRecord
from app.blueprints.caregiver.http_auth import basic_auth, token_auth


# Create a user
@care_api.route('/sign_up', methods=['POST'])
def create_caregiver():
    data = request.json
    # Validate the data
    for field in ['phone', 'email', 'address', 'intro', 'birthday',  'password', 'first_name', 'last_name']:
        if field not in data:
            return jsonify({'error': f"You are missing the {field} field"}), 400

    # Grab the data from the request body
    email = data['email']
    phone = data['phone']

    # Check if the username or email already exists
    care_exists = Caregiver.query.filter((Caregiver.phone == phone)|(Caregiver.email == email)).all()
    # if it is, return back to register
    if care_exists:
        return jsonify({'error': f"Elder with phone {phone} or email {email} already exists"}), 400

    # Create the new user
    # new_user = User(username=username, email=email, password=password)
    new_care = Caregiver(**data)

    return jsonify(new_care.to_dict())


@care_api.route('/token', methods=['POST'])
@basic_auth.login_required
def get_token():
    user = basic_auth.current_user()
    token = user.get_token()

    return jsonify({'token': token, "kind": "caregiver"})


# Update a user by id
@care_api.route('/<int:id>/update', methods=['PUT'])
@token_auth.login_required
def update_user(id):
    current_user = token_auth.current_user()
    if current_user.id != id:
        return jsonify({'error': 'You do not have access to update this user'}), 403
    user = Caregiver.query.get_or_404(id)
    data = request.json
    user.update(data)
    return jsonify(user.to_dict())


# Get user info from token
@care_api.route('/me')
@token_auth.login_required
def me():
    print(111)
    return token_auth.current_user().to_dict()


# Get user info from token
@care_api.route('/create_service/<int:st_id>', methods=['POST'])
@token_auth.login_required
def create_service(st_id):
    if not request.is_json:
        return jsonify({'error': 'Please send a body'}), 400

    service_type = ServiceType.query.get_or_404(st_id)

    data = request.json
    # Validate the data
    for field in ['price', 'duration']:
        if field not in data:
            return jsonify({'error': f"You are missing the {field} field"}), 400
    current_user = token_auth.current_user()
    data['caregiver_id'] = current_user.id
    data['st_id'] = st_id
    new_service = Service(**data)
    return jsonify(new_service.to_dict()), 201


# Get all posts
@care_api.route('/servicetypes')
def get_service_types():
    service_types = ServiceType.query.all()
    kinds = []
    st_dict = {}
    for st in service_types:
        stid = st.id
        kind = st.kind
        sub_type = st.sub_type
        desc = st.desc
        if kind in st_dict:
            st_dict[kind].append({
                "sub_type": sub_type,
                "stid": stid,
                "desc": desc
            })
        else:
            st_dict[kind] = [
                {
                    "sub_type": sub_type,
                    "stid": stid,
                    "desc": desc
                }
            ]
            kinds.append(kind)
    return jsonify({
        "kinds": kinds,
        "data": st_dict
    })


# Get all posts
@care_api.route('/<int:cid>/services')
def get_services(cid):
    services = Service.query.filter((Service.caregiver_id==cid)).all()
    return jsonify([s.to_dict() for s in services])


# Update a single post with id
@care_api.route('/services/<int:sid>', methods=['PUT'])
@token_auth.login_required
def update_service(sid):
    service = Service.query.get_or_404(sid)
    user = token_auth.current_user()
    if user.id != service.caregiver_id:
        return jsonify({'error': 'You are not allowed to edit this service'}), 403
    data = request.json
    service.update(data)
    return jsonify(service.to_dict())


# Delete a single post with id
@care_api.route('/services/<int:sid>', methods=['DELETE'])
@token_auth.login_required
def delete_service(sid):
    service = Service.query.get_or_404(sid)
    user = token_auth.current_user()
    if user.id != service.caregiver_id:
        return jsonify({'error': 'You are not allowed to edit this service'}), 403
    service.delete()
    return jsonify({'success': f'{service.id} has been deleted'})



@care_api.route('/service_records/')
@token_auth.login_required
def search_service_records():
    current_user = token_auth.current_user()
    args = request.args
    status = args.get('status')

    query = ServiceRecord.query.join(Service, ServiceRecord.sid == Service.id)\
        .filter((Service.caregiver_id==current_user.id))

    if status and status.isdigit():
        status = int(status)
        query = query.filter(
            (ServiceRecord.status == status)
        )

    service_records = query.all()

    return jsonify([sr.to_dict(Service) for sr in service_records])


@care_api.route('/service_record/<int:sr_id>/<int:status>', methods=['PUT'])
@token_auth.login_required
def handle_service_record(sr_id, status):
    current_user = token_auth.current_user()
    service_record = ServiceRecord.query.get_or_404(sr_id)

    srd = service_record.to_dict(Service)
    if srd['service']['caregiver']['id'] != current_user.id:
        return jsonify({'error': 'You are not allowed to edit this service record'}), 403

    if status == 1 or status == 2:
        if srd['status'] == 0:
            service_record.update({"status": status})
            return jsonify({'success': 'handle ok'})
    elif status == 4:
        if srd['status'] == 1:
            service_record.update({"status": status})
            return jsonify({'success': 'handle ok'})

    return jsonify({'error': 'Invalid status change'}), 400


@care_api.route('/service_record/<int:sr_id>', methods=['PUT'])
@token_auth.login_required
def finish_service_record(sr_id, methods=['POST']):
    current_user = token_auth.current_user()
    service_record = ServiceRecord.query.get_or_404(sr_id)

    srd = service_record.to_dict(Service)
    if srd['service']['caregiver']['id'] != current_user.id:
        return jsonify({'error': 'You are not allowed to edit this service record'}), 403

    if srd['status'] != 1:
        return jsonify({'error': 'Invalid status to finish'}), 400

    data = request.json

    to_update = {}
    for field in ["price", "service_time", "service_remark"]:
        if field not in data:
            return jsonify({'error': f'Post body miss data: {field}'}), 400

        to_update[field] = data[field]

    to_update['status'] = 5

    service_record.update(to_update)
    return jsonify(service_record.to_dict(Service))
