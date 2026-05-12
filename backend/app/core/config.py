import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Smart E-Gov AI"
    SUPABASE_URL: str = os.getenv("SUPABASE_URL")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY")
    # Using a smaller model for faster inference if resources are low
    MODEL_NAME: str = "facebook/bart-large-mnli"

settings = Settings()