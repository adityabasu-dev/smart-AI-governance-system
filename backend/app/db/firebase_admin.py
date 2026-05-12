import firebase_admin
from firebase_admin import credentials, firestore
import os

# Path to the service account key file
# Ensure you have downloaded this from Firebase Console
service_key_path = os.path.join(os.path.dirname(__file__), "../../serviceAccountKey.json")

if not firebase_admin._apps:
    cred = credentials.Certificate(service_key_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()