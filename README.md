# اقرأ - Moroccan Literacy App

<div align="center">
  <h1>🇲🇦 تطبيق تعلم العربية لمحاربة الأمية</h1>
  <p><strong>An AI-powered Arabic literacy app designed specifically for Moroccan learners</strong></p>
  
  ![Arabic](https://img.shields.io/badge/Language-Arabic-green)
  ![Moroccan Darija](https://img.shields.io/badge/Dialect-Moroccan%20Darija-orange)
  ![Next.js](https://img.shields.io/badge/Frontend-Next.js-blue)
  ![FastAPI](https://img.shields.io/badge/Backend-FastAPI-red)
  ![AI Powered](https://img.shields.io/badge/AI-Powered-purple)
</div>

## 📖 About

**اقرأ (Iqra)** is an innovative literacy application designed to help Moroccan adults learn to read and write in Arabic. The app combines modern AI technology with culturally relevant content, using Moroccan Darija (dialect) to make learning accessible and engaging for native speakers.

### 🎯 Mission
To combat illiteracy in Morocco by providing an intuitive, AI-powered learning platform that respects local culture and language preferences.

## ✨ Features

### 🔤 **Letter Learning (تعلم الحروف)**
- Interactive Arabic alphabet learning
- Visual recognition exercises
- Handwriting practice with AI verification
- Audio pronunciation guides

### 🖼️ **Image-Text Verification**
- Upload images containing Arabic text
- AI-powered verification of handwritten letters
- Real-time feedback on writing accuracy
- Support for various image formats

### 🎤 **Audio Transcription**
- Voice-to-text conversion for Arabic
- Pronunciation practice
- Audio feedback and correction
- Support for multiple audio formats

### 💬 **AI Conversation (محادثة ذكية)**
- Chat with AI in Moroccan Darija
- Contextual learning conversations
- Cultural sensitivity in responses
- Progressive difficulty levels

### 📚 **Progressive Learning Path**
- **Letters (الحروف)**: Start with individual Arabic letters
- **Words (الكلمات)**: Combine letters into simple words
- **Sentences (الجمل)**: Form complete sentences
- **Conversation (المحادثة)**: Practice real-world communication

## 🏗️ Architecture

The application follows a modern full-stack architecture:

```
moroccan-literacy-app/
├── frontend/          # Next.js React application
│   ├── app/          # App router pages
│   ├── components/   # Reusable UI components
│   └── public/       # Static assets
├── backend/          # FastAPI Python server
│   ├── main.py      # API endpoints
│   ├── config.py    # Configuration
│   └── requirements.txt
└── README.md        # This file
```

### 🎨 Frontend (Next.js + TypeScript)
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with Moroccan-inspired design
- **UI Components**: Radix UI primitives
- **Language**: TypeScript for type safety
- **Features**: Responsive design, dark mode support

### ⚡ Backend (FastAPI + Python)
- **Framework**: FastAPI for high-performance APIs
- **AI Integration**: 
  - Google Gemini for text verification
  - OpenAI Whisper for audio transcription
- **Image Processing**: PIL (Pillow) for image handling
- **Audio Processing**: FFmpeg for audio conversion

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm/pnpm
- **Python** 3.8+
- **FFmpeg** (for audio processing)
- **Google AI API Key** (for text verification)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd moroccan-literacy-app
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment (optional)
cp .env.example .env
# Edit .env with your API keys
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Required
GOOGLE_API_KEY=your_google_ai_api_key

# Optional
HOST=0.0.0.0
PORT=8000
DEBUG=True
ALLOWED_ORIGINS=http://localhost:3000
WHISPER_MODEL=medium
MAX_FILE_SIZE=50
```

### API Keys Setup

1. **Google AI API Key**: 
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env` file


## 🎨 Design Philosophy

### Cultural Sensitivity
- **Moroccan Zellij Patterns**: Traditional geometric designs in the UI
- **Darija Integration**: Uses Moroccan dialect for natural communication
- **Local Context**: Content relevant to Moroccan culture and daily life

### Accessibility
- **Simple Interface**: Clean, intuitive design for all literacy levels
- **Visual Learning**: Heavy use of images and visual cues
- **Audio Support**: Voice guidance for non-readers
- **Progressive Difficulty**: Gradual learning curve

## 🔍 API Reference

### Text Verification
```http
POST /verify-text
Content-Type: multipart/form-data

text: "أ"
image: [image file]
```

### Audio Transcription
```http
POST /transcribe-audio
Content-Type: multipart/form-data

audio: [audio file]
language: "ar"
```

### Health Check
```http
GET /health
```

## 🛠️ Development

### Adding New Features

1. **Frontend**: Add new pages in `frontend/app/`
2. **Backend**: Add new endpoints in `backend/main.py`
3. **Components**: Create reusable components in `frontend/components/`

### Testing

```bash
# Backend tests
cd backend
python test_api.py

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

**Backend:**
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Docker Support (Coming Soon)
- Containerized deployment
- Docker Compose for full stack
- Production-ready configurations

## 🤝 Contributing

We welcome contributions to improve literacy education in Morocco!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Areas for Contribution
- **Content**: More Arabic learning materials
- **Languages**: Support for Berber (Tamazight)
- **Features**: New learning exercises
- **Accessibility**: Improved accessibility features
- **Performance**: Optimization improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Moroccan Ministry of Education** for literacy program insights
- **Google AI** for Gemini API access
- **OpenAI** for Whisper speech recognition
- **Moroccan Cultural Heritage** for design inspiration

## 📞 Support

For questions, suggestions, or support:
- **Issues**: Create a GitHub issue
- **Email**: [Your contact email]
- **Documentation**: Check `/docs` endpoint for API details

---

<div align="center">
  <p><strong>Made with ❤️ for Morocco 🇲🇦</strong></p>
  <p>تطبيق مصنوع بحب للمغرب</p>
</div> 
