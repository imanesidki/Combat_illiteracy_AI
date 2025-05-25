#!/usr/bin/env python3
"""
Startup script for the Moroccan Literacy App Backend API
"""

import sys
import os
import subprocess
from pathlib import Path

def check_ffmpeg():
    """Check if FFmpeg is installed"""
    try:
        subprocess.run(['ffmpeg', '-version'], 
                      stdout=subprocess.DEVNULL, 
                      stderr=subprocess.DEVNULL, 
                      check=True)
        print("✅ FFmpeg is installed")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ FFmpeg is not installed or not in PATH")
        print("Please install FFmpeg:")
        print("  macOS: brew install ffmpeg")
        print("  Ubuntu/Debian: sudo apt install ffmpeg")
        print("  Windows: Download from https://ffmpeg.org/download.html")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print(f"❌ Python 3.8+ required, but you have {sys.version}")
        return False
    print(f"✅ Python {sys.version.split()[0]} is compatible")
    return True

def install_dependencies():
    """Install Python dependencies"""
    try:
        print("📦 Installing Python dependencies...")
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], 
                      check=True)
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def start_server():
    """Start the FastAPI server"""
    try:
        print("🚀 Starting the server...")
        print("📖 API Documentation will be available at:")
        print("   - http://localhost:8000/docs (Swagger UI)")
        print("   - http://localhost:8000/redoc (ReDoc)")
        print("🔗 API Base URL: http://localhost:8000")
        print("\n" + "="*50)
        
        # Import and run the main application
        from main import app, settings
        import uvicorn
        
        uvicorn.run(
            app,
            host=settings.HOST,
            port=settings.PORT,
            reload=settings.DEBUG,
            log_level="info"
        )
    except ImportError as e:
        print(f"❌ Failed to import application: {e}")
        print("Make sure all dependencies are installed correctly")
        return False
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        return False

def main():
    """Main startup function"""
    print("🇲🇦 Moroccan Literacy App - Backend API")
    print("="*50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Check if we're in the right directory
    if not Path('requirements.txt').exists():
        print("❌ requirements.txt not found. Make sure you're in the backend directory.")
        sys.exit(1)
    
    # Check FFmpeg
    if not check_ffmpeg():
        print("\n⚠️  FFmpeg is required for audio processing.")
        response = input("Continue anyway? (y/N): ").lower().strip()
        if response != 'y':
            sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        sys.exit(1)
    
    # Start server
    start_server()

if __name__ == "__main__":
    main() 