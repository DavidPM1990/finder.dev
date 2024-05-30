from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_bcrypt import generate_password_hash
from flask_bcrypt import check_password_hash
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import JWTManager
from database import db
from models import User, Like
from flask_cors import cross_origin

api = Blueprint('api', __name__)

def create_user_blueprint():
    return api


@api.route('/create_user', methods=['POST'])
def create_user():
    data = request.get_json()

    required_fields = ['username', 'email', 'password', 'programming_language', 'location']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing {field} field'}), 400

    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    
    hashed_password = generate_password_hash(data['password']).decode('utf-8')

    new_user = User(
        username=data['username'],
        email=data['email'],
        password=hashed_password, 
        programming_language=data['programming_language'],
        location=data['location']
    )

    db.session.add(new_user)

    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201

@api.route('/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()

        user_list = []
        for user in users:
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'programming_language': user.programming_language,
                'location': user.location
            }
            user_list.append(user_data)

        return jsonify({'users': user_list}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@api.route('/delete_user', methods=['DELETE'])
def delete_user():
    data = request.get_json()

    required_fields = ['email', 'password']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing {field} field'}), 400

    user = User.query.filter_by(email=data['email']).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    if not Bcrypt().check_password_hash(user.password, data['password']):
        return jsonify({'error': 'Incorrect password'}), 401

    db.session.delete(user)
    db.session.commit()

    return jsonify({'message': 'User deleted successfully'}), 200


@api.route('/edit_user', methods=['PUT'])
def edit_user():
    data = request.get_json()

    required_fields = ['email', 'password']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing {field} field'}), 400

    user = User.query.filter_by(email=data['email']).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    if not Bcrypt().check_password_hash(user.password, data['password']):
        return jsonify({'error': 'Incorrect password'}), 401

    if 'username' in data:
        user.username = data['username']
    if 'new_password' in data:
        user.password = Bcrypt().generate_password_hash(data['new_password']).decode('utf-8')
    if 'programming_language' in data:
        user.programming_language = data['programming_language']
    if 'location' in data:
        user.location = data['location']

    db.session.commit()

    return jsonify({'message': 'User data updated successfully'}), 200

@api.route('/login', methods=['POST'])
def log_in():
    data = request.get_json()

    # Verifico si todos los campos requeridos están presentes
    if not all(field in data for field in ['username', 'password']):
        return jsonify({"msg": "Missing fields"}), 400

    # Obtengo el usuario de la base de datos según el nombre de usuario
    user = User.query.filter_by(username=data['username']).first()

    # Verifico si el usuario existe y si la contraseña coincide
    if user and check_password_hash(user.password, data['password']):
        # Genero un token de acceso JWT
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token, user_id=user.id), 200
    else:
        return jsonify({"msg": "Bad username or password"}), 401
    
@api.route("/profile/<int:user_id>", methods=["GET", "PUT"])
@jwt_required()
def profile(user_id):
    # Verificamos si el usuario autenticado es el mismo que se está solicitando o modificando
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        return jsonify({"message": "Unauthorized"}), 401

    # Obtengo la información del usuario actual desde la base de datos
    current_user = User.query.get(user_id)

    if request.method == "GET":
        # Si es una solicitud GET, devuelvo los detalles del usuario
        return jsonify(current_user.serialize()), 200
                       
    elif request.method == "PUT":
        # Si es una solicitud PUT, actualizo el perfil del usuario
        data = request.get_json()

        # Actualizo los campos relevantes
        if 'username' in data:
            current_user.username = data['username']
        if 'email' in data:
            current_user.email = data['email']
        if 'password' in data:
            current_user.password = generate_password_hash(data['password']).decode('utf-8')
        if 'programming_language' in data:
            current_user.programming_language = data['programming_language']
        if 'location' in data:
            current_user.location = data['location']
        if 'avatar_url' in data:
            current_user.avatar_url = data['avatar_url']
        if 'description' in data:
            current_user.description = data['description']

        # Guardo los cambios en la base de datos
        db.session.commit()
        message = {"message": "The user has been updated"}
        final_data = {**current_user.serialize(), **message}

        return jsonify(final_data), 200
    
@api.route("/profile-partner/<int:user_id>", methods=["GET"])
def profilePartner(user_id):
    # Obtengo la información del usuario desde la base de datos
    user = User.query.get(user_id)

    # Verifico si el usuario existe
    if user is None:
        return jsonify({"message": "User not found"}), 404

    # Devuelvo los detalles del usuario
    return jsonify(user.serialize()), 200


@api.route("/like/<int:liked_user_id>", methods=["POST"])
@jwt_required()
def like_user(liked_user_id):
    current_user_id = get_jwt_identity()

    # Verifica si el usuario que da like y el usuario que recibe like son el mismo
    if current_user_id == liked_user_id:
        return jsonify({"message": "You cannot like yourself"}), 400

    # Verifica si el usuario que recibe like existe
    liked_user = User.query.get(liked_user_id)
    if not liked_user:
        return jsonify({"message": "Liked user not found"}), 404

    # Verifica si el usuario ya le ha dado like al usuario objetivo
    existing_like = Like.query.filter_by(user_id=current_user_id, liked_user_id=liked_user_id).first()
    if existing_like:
        return jsonify({"message": "You have already liked this user"}), 400

    # Crea una nueva instancia de Like
    new_like = Like(user_id=current_user_id, liked_user_id=liked_user_id)

    # Guarda la instancia de Like en la base de datos
    db.session.add(new_like)
    db.session.commit()

    return jsonify({"message": "User liked successfully"}), 201

@api.route("/dislike/<int:liked_user_id>", methods=["POST"])
@jwt_required()
def dislike_user(liked_user_id):
    current_user_id = get_jwt_identity()

    # Verifica si el usuario que da dislike y el usuario que recibe dislike son el mismo
    if current_user_id == liked_user_id:
        return jsonify({"message": "You cannot dislike yourself"}), 400

    # Verifica si el usuario que recibe dislike existe
    liked_user = User.query.get(liked_user_id)
    if not liked_user:
        return jsonify({"message": "Liked user not found"}), 404

    # Verifica si el usuario ya le ha dado like al usuario objetivo
    existing_like = Like.query.filter_by(user_id=current_user_id, liked_user_id=liked_user_id).first()
    if not existing_like:
        return jsonify({"message": "You have not liked this user"}), 400

    # Elimina la instancia de Like de la base de datos
    db.session.delete(existing_like)
    db.session.commit()

    return jsonify({"message": "User disliked successfully"}), 200

@api.route("/followed-users/<int:user_id>", methods=["GET"])
# @cross_origin(headers=["Content-Type", "Authorization"]) 
@jwt_required()
def get_followed_users(user_id):
    # Obtener todos los usuarios seguidos por el usuario con el ID proporcionado
    followed_likes = Like.query.filter_by(user_id=user_id).all()
    followed_users_data = []
    
    for like in followed_likes:
        user = User.query.get(like.liked_user_id)
        if user:
            followed_users_data.append({
                "id": user.id,
                "username": user.username,
                "programming_language": user.programming_language,
                "location": user.location  # Ajusta esto según tu modelo
            })
    
    return jsonify(followed_users_data), 200

