# CompanionAI

CompanionAI is a full-stack AI-powered chat application that allows users to interact with customizable AI personas. Users can chat with different personas, create their own, and manage their profiles with advanced preferences. The app features authentication, theming, and a modern, responsive UI.

## Features

- **AI Chat Personas:**
  - Predefined and user-created personas with unique traits, tone, and style.
  - Dynamic persona switching and persona builder UI.
- **User Authentication:**
  - Signup and login with JWT-based authentication.
  - Profile management with detailed fields (DOB, gender, preferences, etc.).
  - Secure access: chat is open, but persona creation/profile editing requires login.
- **Modern UI/UX:**
  - Responsive, themeable (light/dark) React frontend.
  - Aesthetic login/signup pages, profile modal, and chat interface.
- **Backend API:**
  - FastAPI backend for chat, persona management, and user authentication.
  - Persona configs stored as JSON files.
- **Vector DB Integration:**
  - (Planned/Optional) Vector database setup for advanced persona memory and retrieval.

## Project Structure

```
CompanionAI/
├── backend/
│   ├── main.py                # FastAPI app entry point
│   ├── vector_db_setup.py     # (Optional) Vector DB setup
│   ├── agents/
│   │   └── persona_agent.py   # Persona chat logic
│   ├── prompts/
│   │   └── persona_template.txt
│   └── utils/
│       ├── chat_parser.py
│       └── trait_extractor.py
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main React app
│   │   ├── main.jsx           # React entry point
│   │   ├── App.css, index.css # Styles
│   │   └── assets/
│   ├── pages/
│   │   ├── Chat.jsx           # Main chat UI
│   │   ├── Login.jsx          # Login page
│   │   └── Signup.jsx         # Signup page
│   ├── components/
│   │   └── ChatBubble.jsx
│   ├── public/
│   │   └── vite.svg
│   ├── index.html
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js
├── persona-configs/           # Persona JSON files
├── requirements.txt           # Python dependencies
├── pyproject.toml             # Python project config
├── package.json               # (Root) Project metadata
├── uv.lock                    # Python lock file
└── README.md                  # (You are here)
```

## Setup Instructions

### Prerequisites
- Node.js (v16+ recommended)
- Python 3.10+
- (Optional) pip, virtualenv, or uv

### 1. Backend Setup

1. **Install Python dependencies:**
   ```sh
   pip install -r requirements.txt
   # or, if using uv:
   uv pip install -r requirements.txt
   ```
2. **Set up environment variables:**
   - Create a `.env` file in `backend/` with your API keys and secrets as needed.
3. **Run the FastAPI server:**
   ```sh
   cd backend
   uvicorn main:app --reload
   # or
   python -m uvicorn main:app --reload
   ```
   - The API will be available at `http://localhost:8000`

### 2. Frontend Setup

1. **Install Node dependencies:**
   ```sh
   cd frontend
   npm install
   ```
2. **Run the React app:**
   ```sh
   npm run dev
   ```
   - The app will be available at `http://localhost:5173` (default Vite port)

### 3. Persona Configs
- Persona JSON files are stored in `persona-configs/`.
- You can add new personas via the UI or by placing JSON files in this folder.

## Usage

- **Chat:**
  - Anyone can chat with AI personas without logging in.
- **Profile & Persona Management:**
  - Signup/login to create or edit your profile and custom personas.
  - Access the profile modal from the chat UI to edit your details or logout.
- **Theming:**
  - Toggle between light and dark mode from the chat header.

## API Endpoints (Backend)

- `POST /signup` — Register a new user
- `POST /login` — Authenticate and receive JWT
- `GET /profile` — Get user profile (auth required)
- `POST /profile` — Update user profile (auth required)
- `POST /create_persona/` — Create a new persona (auth required)
- `GET /chat` — Get AI response for a persona

## Customization

- **Add new personas:** Use the UI or add JSON files to `persona-configs/`.
- **Modify persona templates:** Edit `backend/prompts/persona_template.txt`.
- **Change theming:** Edit `frontend/src/App.css` and related CSS files.

## Security Notes
- JWT tokens are stored in `localStorage` for simplicity. For production, consider more secure storage and HTTPS.
- CORS is enabled for local development. Adjust as needed for deployment.

## License

This project is for educational and personal use. For commercial use, please review dependencies and licenses.

---

**Enjoy building your own AI companion experience!**
