# Moroccan Literacy App - Backend API

A FastAPI-based backend service for Arabic text verification and audio transcription using Google's Generative AI and OpenAI Whisper.

## Features

- **Text Verification**: Compare Arabic text with text in images using Google's Gemini AI
- **Audio Transcription**: Transcribe Arabic audio files to text using OpenAI Whisper
- **RESTful API**: Clean, documented API endpoints
- **File Upload Support**: Handle image and audio file uploads
- **CORS Support**: Configured for frontend integration

## API Endpoints

### 1. Text Verification
- **Endpoint**: `POST /verify-text`
- **Description**: Verify if Arabic text matches text in an uploaded image
- **Parameters**:
  - `text` (form field): Arabic text to verify
  - `image` (file): Image file containing Arabic text
- **Response**: JSON with verification result

### 2. Audio Transcription
- **Endpoint**: `POST /transcribe-audio`
- **Description**: Transcribe Arabic audio to text
- **Parameters**:
  - `audio` (file): Audio file to transcribe
  - `language` (form field, optional): Language code (default: "ar")
- **Response**: JSON with transcribed text

### 3. Health Check
- **Endpoint**: `GET /health`
- **Description**: Check API health and model status
- **Response**: JSON with system status

## Installation

### Prerequisites

- Python 3.8 or higher
- FFmpeg (for audio processing)

### Setup

1. **Clone the repository and navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Install FFmpeg** (required for audio processing):
   
   **On macOS**:
   ```bash
   brew install ffmpeg
   ```
   
   **On Ubuntu/Debian**:
   ```bash
   sudo apt update
   sudo apt install ffmpeg
   ```
   
   **On Windows**:
   Download from [FFmpeg official website](https://ffmpeg.org/download.html)

5. **Configure environment variables**:
   Copy the sample environment file and add your API keys:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and replace `your_google_gemini_api_key_here` with your actual Google Gemini API key:
   ```env
   GOOGLE_API_KEY=your_actual_google_gemini_api_key_here
   HOST=0.0.0.0
   PORT=8000
   DEBUG=True
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
   WHISPER_MODEL=medium
   ```

## Running the Application

### Development Mode

```bash
python main.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Production Mode

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Documentation**: http://localhost:8000/docs
- **Alternative Documentation**: http://localhost:8000/redoc

## API Usage Examples

### Text Verification

```bash
curl -X POST "http://localhost:8000/verify-text" \
  -H "Content-Type: multipart/form-data" \
  -F "text=أ" \
  -F "image=@path/to/your/image.jpg"
```

### Audio Transcription

```bash
curl -X POST "http://localhost:8000/transcribe-audio" \
  -H "Content-Type: multipart/form-data" \
  -F "audio=@path/to/your/audio.mp3" \
  -F "language=ar"
```

### Health Check

```bash
curl -X GET "http://localhost:8000/health"
```

## Supported File Formats

### Images
- JPEG/JPG
- PNG
- GIF
- BMP
- WebP

### Audio
- MP3
- WAV
- M4A
- OGG
- FLAC

## Configuration

The application can be configured using environment variables or by modifying the `config.py` file:

- `GOOGLE_API_KEY`: Your Google Generative AI API key
- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 8000)
- `DEBUG`: Enable debug mode (default: True)
- `ALLOWED_ORIGINS`: CORS allowed origins
- `WHISPER_MODEL`: Whisper model size (tiny, base, small, medium, large)
- `MAX_FILE_SIZE`: Maximum file upload size in MB (default: 50)

## Model Information

### Whisper Models
- **tiny**: Fastest, least accurate (~39 MB)
- **base**: Good balance (~74 MB)
- **small**: Better accuracy (~244 MB)
- **medium**: High accuracy (~769 MB) - Default
- **large**: Best accuracy (~1550 MB)

### Google Generative AI
- Uses Gemini 1.5 Flash model for text verification
- Requires a valid Google AI API key

## Error Handling

The API includes comprehensive error handling:
- File type validation
- File size limits
- Model loading errors
- API key validation
- Temporary file cleanup

## Security Considerations

- Store API keys in environment variables
- Configure CORS origins properly for production
- Implement rate limiting for production use
- Use HTTPS in production
- Validate and sanitize all inputs

## Development

### Project Structure
```
backend/
├── main.py              # FastAPI application
├── config.py            # Configuration settings
├── requirements.txt     # Python dependencies
├── README.md           # This file
└── .env                # Environment variables (create this)
```

### Adding New Endpoints

1. Add the endpoint function to `main.py`
2. Update the documentation
3. Add any new dependencies to `requirements.txt`
4. Update configuration if needed

## Troubleshooting

### Common Issues

1. **FFmpeg not found**: Install FFmpeg system-wide
2. **CUDA errors**: Whisper will fall back to CPU automatically
3. **API key errors**: Verify your Google AI API key
4. **File upload errors**: Check file size and format
5. **CORS errors**: Update `ALLOWED_ORIGINS` in configuration

### Logs

The application logs important events and errors. Check the console output for debugging information.

## License

This project is part of the Moroccan Literacy App. 