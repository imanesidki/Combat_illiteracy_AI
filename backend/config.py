import os
from typing import List
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings:
    """Application settings and configuration"""
    
    # API Keys
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "AIzaSyA7D7pe7cnKK1o-195FKE_GCuW65ckrafs")
    
    # Server Configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = os.getenv(
        "ALLOWED_ORIGINS", 
        "http://localhost:3000,http://localhost:8080,http://127.0.0.1:3000"
    ).split(",")
    
    # Model Configuration
    WHISPER_MODEL: str = os.getenv("WHISPER_MODEL", "medium")
    
    # File Upload Limits
    MAX_FILE_SIZE: int = int(os.getenv("MAX_FILE_SIZE", "50")) * 1024 * 1024  # 50MB default
    
    # Supported file types
    SUPPORTED_IMAGE_TYPES: List[str] = [
        "image/jpeg", "image/jpg", "image/png", "image/gif", "image/bmp", "image/webp"
    ]
    
    SUPPORTED_AUDIO_TYPES: List[str] = [
        "audio/mpeg", "audio/mp3", "audio/wav", "audio/m4a", "audio/ogg", "audio/flac"
    ]

# Create settings instance
settings = Settings() 