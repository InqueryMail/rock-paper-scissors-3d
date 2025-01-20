from flask import Flask, request, jsonify, send_from_directory # type: ignore
from flask_cors import CORS # type: ignore
from pymongo import MongoClient # type: ignore
import os
from datetime import datetime
import uuid
from werkzeug.utils import secure_filename # type: ignore
from pprof_crat import mint_nft  # Make sure to import your minting script

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# MongoDB URI
MONGO_URI = "mongodb+srv://user:admin@cluster0.htinv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client["game_data"]
users_collection = db["users"]  # Collection for user data
games_collection = db["games"]  # Collection for game data

# Profile image upload folder (make sure the folder exists)
UPLOAD_FOLDER = 'uploads/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route("/admin/routes", methods=["GET"])
def admin_routes():
    """Return a list of all routes and their methods."""
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            "endpoint": rule.endpoint,
            "methods": list(rule.methods),
            "url": str(rule)
        })
    return jsonify(routes), 200

@app.route("/login", methods=["POST"])
def login():
    """Handle login with MetaMask and user profile creation."""
    if 'walletAddress' not in request.form or 'username' not in request.form:
        return jsonify({"error": "Wallet address and username are required"}), 400

    wallet_address = request.form['walletAddress']
    username = request.form['username']

    # Handle profile image upload
    profile_image = request.files.get('profile_image')
    if profile_image:
        filename = secure_filename(profile_image.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        profile_image.save(file_path)
    else:
        file_path = None

    # Check if the user exists in the database
    user = users_collection.find_one({"wallet_address": wallet_address})

    if not user:
        # New user creation
        new_user = {
            "wallet_address": wallet_address,
            "username": username,
            "profile_image": file_path,  # Save image path to MongoDB
            "created_at": datetime.now()
        }
        users_collection.insert_one(new_user)
        
        # Call mint_nft with the correct arguments (including the username)
        mint_nft(wallet_address, username, f"http://127.0.0.1:5000/uploads/{filename}")

        return jsonify({
            "message": "Wallet connected successfully. Username set.",
            "newUser": True,
            "username": username,
            "profile_image": file_path
        }), 200

    # Existing user return
    return jsonify({
        "message": "Wallet connected successfully.",
        "newUser": False,
        "walletAddress": wallet_address,
        "username": user.get("username"),
        "profile_image": user.get("profile_image")
    }), 200

# Route to serve the profile images
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route("/store-game-data", methods=["POST"])
def store_game_data():
    """Store game data in MongoDB."""
    data = request.json
    mode = data.get("mode")
    walletAddress = data.get("walletAddress")
    rounds = data.get("rounds")
    winner = data.get("winner")
    player_score = data.get("playerScore")
    computer_score = data.get("computerScore")

    # Check if all necessary data is present
    if not all([mode, rounds, winner is not None, player_score is not None, computer_score is not None]):
        return jsonify({"error": "Missing required data"}), 400

    # Prepare the document to be inserted into MongoDB
    game_data = {
        "mode": mode,
        "rounds": rounds,
        "winner": winner,
        "player_score": player_score,
        "walletAddress": walletAddress,
        "computer_score": computer_score,
        "timestamp": datetime.now()  # Store the current timestamp
    }

    # Insert the document into the MongoDB collection
    games_collection.insert_one(game_data)

    # Send a success response back to the frontend
    return jsonify({"message": "Game data saved successfully"}), 200

@app.route("/check-user/<wallet_address>", methods=["GET"])
def check_user(wallet_address):
    """Check if the user exists in the database."""
    user = users_collection.find_one({"wallet_address": wallet_address})
    if user:
        return jsonify({
            "exists": True,
            "username": user.get("username"),
            "profile_image": user.get("profile_image"),
        }), 200
    return jsonify({"exists": False}), 200

if __name__ == "__main__":
    app.run(debug=True)
