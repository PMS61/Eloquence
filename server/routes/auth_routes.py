from flask import Blueprint, request, jsonify
from utils.auth import hash_password, check_password, generate_token, verify_token
import pymongo

# Define a Blueprint for authentication routes
auth_bp = Blueprint('auth', __name__, url_prefix='/auth')  # Add url_prefix here

# MongoDB connection
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["Eloquence"]
collections_user = db["user"]


# ROUTE 1 :create a user using POST : auth/create  , doesnt require auth
@auth_bp.route('/create', methods=['POST'])  # Change to /create
def create_user():
    try:
        data = request.get_json()
        username = data['username']
        email = data['email']
        password = data['password']

        # Hash the password
        hashed_password = hash_password(password)

        # Check if user already exists
        if collections_user.find_one({'email' : email }):
            return jsonify({"error": "User with this email already exists"}), 400

        # Insert the new user
        collections_user.insert_one({'username': username, 'password': hashed_password , 'email': email})
        
        # Generate JWT token
        token = generate_token(email)
        return jsonify({"message": "User created", "token": token}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500




# ROUTE 2 :authenticate a user using POST : auth/login   , no login required
@auth_bp.route('/login', methods=['POST']) 
def login_user():
    try:
        data = request.get_json()
        email = data['email']
        password = data['password']

        user = collections_user.find_one({'email': email})
        if not user:
            return jsonify({"error": "User not found"}), 404

       
        if not check_password(user['password'], password):
            return jsonify({"error": "Invalid password"}), 401

        # Generate JWT token
        token = generate_token(email)
        return jsonify({"message": "Login successful", "token": token}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Protected Route Example
# ROUTE 3 : get loggedIn user details using POST : auth/protected , login reuqired
@auth_bp.route('/protected', methods=['POST'])
def protected():
   # get token from the body as its a post method 
    token = request.json.get("token", None)
    


    if not token:
        return jsonify({"error": "Token missing"}), 401

    # Remove 'Bearer ' from the token string if it's present
    token = token.replace("Bearer ", "")
    username = verify_token(token)  # Verify the token

    if not username:
        return jsonify({"error": "Invalid or expired token"}), 401

    return jsonify({"message": f"Hello, {username}! This is a protected route."})
