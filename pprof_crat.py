import http.client
import json
import uuid
import hashlib
import random

# Immutable X API details
API_KEY = "sk_imapik-test-FL1FIEXgEVxMM0G5RDsU_bb72e9"
COLLECTION_ADDRESS = "0x29f51c15546a1cf2d5145d75a11e1920c5c9d21a"
BASE_URL = "api.sandbox.immutable.com"

# Function to generate a numeric token ID from a UUID
def generate_token_id(uuid_string):
    return int(hashlib.sha256(uuid_string.encode()).hexdigest(), 16) % (10**18)  # Limiting to 18 digits

# Mint NFT function
def mint_nft(owner_address, username, profile_image_url):
    # Generate a random token_id between 1 and 10,000
    token_id = random.randint(1, 10000)
    print(f"Starting NFT minting process for Token ID: {token_id} and Owner Address: {owner_address}")
    
    conn = http.client.HTTPSConnection(BASE_URL)
    reference_id = str(uuid.uuid4())  # Generate a new unique reference_id

    # Convert token_id to string (required by Immutable X API)
    str_token_id = str(token_id)

    payload = {
        "assets": [
            {
                "reference_id": reference_id,
                "owner_address": owner_address,
                "token_id": str_token_id,  # Ensure token_id is a string
                "amount": "1",  # Optional for ERC721
                "metadata": {
                    "name": f"Player Profile: {username}",
                    "description": f"A profile NFT for {username}",
                    "image": profile_image_url,  # Use the profile image URL from Flask app
                    "external_url": "https://example.com",
                    "attributes": [
                        {"trait_type": "Username", "value": username},  # Using the username in the NFT metadata
                        {"trait_type": "Wins", "value": "0"},
                        {"trait_type": "Games Played", "value": "0"},
                        {"trait_type": "Level", "value": "1"}
                    ]
                }
            }
        ]
    }

    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "x-immutable-api-key": API_KEY
    }

    endpoint = f"/v1/chains/imtbl-zkevm-testnet/collections/{COLLECTION_ADDRESS}/nfts/mint-requests"

    try:
        conn.request("POST", endpoint, json.dumps(payload), headers)
        res = conn.getresponse()
        data = res.read()

        if res.status == 202:
            response_data = json.loads(data.decode("utf-8"))
            print("NFT Minting request submitted successfully!")
            print(json.dumps(response_data, indent=4))
        else:
            print(f"Failed to mint NFT. Status Code: {res.status}")
            print(f"Error details: {data.decode('utf-8')}")
    except Exception as e:
        print(f"Error: {str(e)}")
    finally:
        conn.close()

if __name__ == "__main__":
    pass
