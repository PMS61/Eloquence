import jwt
import bcrypt

SECRET_KEY = "eloquence_key"  

# Hash the password
def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

# Check the hashed password
def check_password(hashed_password, password):
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password)

# Generate JWT
def generate_token(username):
    payload = {
        'username': username,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

# Verify JWT
def verify_token(token):
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return decoded['username']  # Return username if token is valid
    except jwt.ExpiredSignatureError:
        return None  # Token has expired
    except jwt.InvalidTokenError:
        return None  # Token is invalid
