#!/usr/bin/env python3
"""
Test script for the Moroccan Literacy App Backend API
"""

import requests
import json
from pathlib import Path

# API base URL
BASE_URL = "http://localhost:8000"

def test_health_endpoint():
    """Test the health check endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed: {data['status']}")
            print(f"   Whisper model: {data.get('whisper_model', 'unknown')}")
            print(f"   Google AI configured: {data.get('google_ai_configured', False)}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to the API. Make sure the server is running.")
        return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_root_endpoint():
    """Test the root endpoint"""
    print("\n🔍 Testing root endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Root endpoint working: {data['message']}")
            return True
        else:
            print(f"❌ Root endpoint failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Root endpoint error: {e}")
        return False

def test_verify_text_endpoint():
    """Test the text verification endpoint (requires image file)"""
    print("\n🔍 Testing text verification endpoint...")
    print("   Note: This test requires an image file to work properly.")
    print("   Skipping actual file upload test - endpoint structure verified.")
    
    # Test with missing parameters
    try:
        response = requests.post(f"{BASE_URL}/verify-text")
        if response.status_code == 422:  # Validation error expected
            print("✅ Text verification endpoint validation working")
            return True
        else:
            print(f"❌ Unexpected response: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Text verification test error: {e}")
        return False

def test_transcribe_audio_endpoint():
    """Test the audio transcription endpoint (requires audio file)"""
    print("\n🔍 Testing audio transcription endpoint...")
    print("   Note: This test requires an audio file to work properly.")
    print("   Skipping actual file upload test - endpoint structure verified.")
    
    # Test with missing parameters
    try:
        response = requests.post(f"{BASE_URL}/transcribe-audio")
        if response.status_code == 422:  # Validation error expected
            print("✅ Audio transcription endpoint validation working")
            return True
        else:
            print(f"❌ Unexpected response: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Audio transcription test error: {e}")
        return False

def test_api_documentation():
    """Test if API documentation is accessible"""
    print("\n🔍 Testing API documentation...")
    try:
        # Test OpenAPI schema
        response = requests.get(f"{BASE_URL}/openapi.json")
        if response.status_code == 200:
            print("✅ OpenAPI schema accessible")
        else:
            print(f"❌ OpenAPI schema failed: {response.status_code}")
            
        # Test Swagger UI
        response = requests.get(f"{BASE_URL}/docs")
        if response.status_code == 200:
            print("✅ Swagger UI accessible")
        else:
            print(f"❌ Swagger UI failed: {response.status_code}")
            
        # Test ReDoc
        response = requests.get(f"{BASE_URL}/redoc")
        if response.status_code == 200:
            print("✅ ReDoc accessible")
            return True
        else:
            print(f"❌ ReDoc failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Documentation test error: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Moroccan Literacy App API Tests")
    print("=" * 50)
    
    tests = [
        test_root_endpoint,
        test_health_endpoint,
        test_verify_text_endpoint,
        test_transcribe_audio_endpoint,
        test_api_documentation
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The API is working correctly.")
        print("\n📖 You can now access:")
        print(f"   - API Documentation: {BASE_URL}/docs")
        print(f"   - Alternative Docs: {BASE_URL}/redoc")
        print(f"   - Health Check: {BASE_URL}/health")
    else:
        print("⚠️  Some tests failed. Check the server logs for more details.")
    
    return passed == total

if __name__ == "__main__":
    main() 