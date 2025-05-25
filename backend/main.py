from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import google.generativeai as genai
from PIL import Image
import whisper
import tempfile
import os
from typing import Optional
import uvicorn
from config import settings

# Initialize FastAPI app
app = FastAPI(
    title="Moroccan Literacy App API",
    description="API for Arabic text verification and audio transcription",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Google Generative AI
genai.configure(api_key=settings.GOOGLE_API_KEY)

# Load Whisper model globally to avoid reloading
whisper_model = None

def get_whisper_model():
    global whisper_model
    if whisper_model is None:
        whisper_model = whisper.load_model(settings.WHISPER_MODEL)
    return whisper_model

@app.on_event("startup")
async def startup_event():
    """Load models on startup"""
    get_whisper_model()
    print("✅ Models loaded successfully")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Moroccan Literacy App API is running", "status": "healthy"}

@app.post("/verify-text")
async def verify_text(
    text: str = Form(..., description="Arabic text to verify against the image"),
    image: UploadFile = File(..., description="Image file containing Arabic text")
):
    """
    Verify if the text in the uploaded image matches the provided Arabic text.
    
    Args:
        text: Arabic text to compare with
        image: Image file containing Arabic text
    
    Returns:
        JSON response with verification result
    """
    try:
        # Validate file type
        if image.content_type not in settings.SUPPORTED_IMAGE_TYPES:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported image format. Allowed formats: {', '.join(settings.SUPPORTED_IMAGE_TYPES)}"
            )
        
        # Create temporary file for the image
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            content = await image.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        try:
            # Initialize Gemini model
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            # Open and process the image
            pil_image = Image.open(temp_file_path)
            
            # Create Arabic prompt
            prompt = f"قارن النص الموجود في هذه الصورة مع الحرف '{text}'. إذا كانا متطابقين، اكتب فقط: نعم. وإذا كانا مختلفين، اكتب فقط: لا. لا تضف أي كلمة أخرى."
            
            # Generate response
            response = model.generate_content([pil_image, prompt])
            result = response.text.strip()
            
            # Parse result
            is_match = result == "نعم"
            
            return JSONResponse(content={
                "success": True,
                "is_match": is_match,
                "result": result,
                "input_text": text,
                "message": "Text verification completed successfully"
            })
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.post("/transcribe-audio")
async def transcribe_audio(
    audio: UploadFile = File(..., description="Audio file to transcribe"),
    language: str = Form(default="ar", description="Language code (default: ar for Arabic)")
):
    """
    Transcribe Arabic audio to text using OpenAI Whisper.
    
    Args:
        audio: Audio file to transcribe
        language: Language code for transcription (default: 'ar' for Arabic)
    
    Returns:
        JSON response with transcribed text
    """
    try:
        # Validate file type
        if audio.content_type not in settings.SUPPORTED_AUDIO_TYPES:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported audio format. Allowed formats: {', '.join(settings.SUPPORTED_AUDIO_TYPES)}"
            )
        
        # Create temporary file for the audio
        file_extension = audio.filename.split('.')[-1] if '.' in audio.filename else 'mp3'
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file_extension}") as temp_file:
            content = await audio.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        try:
            # Get Whisper model
            model = get_whisper_model()
            
            # Transcribe audio
            result = model.transcribe(temp_file_path, language=language)
            transcribed_text = result["text"]
            
            return JSONResponse(content={
                "success": True,
                "transcribed_text": transcribed_text,
                "language": language,
                "filename": audio.filename,
                "message": "Audio transcription completed successfully"
            })
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error transcribing audio: {str(e)}")

@app.get("/health")
async def health_check():
    """Extended health check with model status"""
    try:
        # Check if models are loaded
        whisper_status = "loaded" if whisper_model is not None else "not loaded"
        
        return JSONResponse(content={
            "status": "healthy",
            "whisper_model": whisper_status,
            "google_ai_configured": bool(settings.GOOGLE_API_KEY),
            "message": "All systems operational"
        })
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "unhealthy", "error": str(e)}
        )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    ) 