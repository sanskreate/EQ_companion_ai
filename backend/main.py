# FastAPI backend entry point
from fastapi import FastAPI
from backend.agents.persona_agent import chat_with_persona
from fastapi import UploadFile, Form
from backend.utils.chat_parser import clean_chat_text
from backend.utils.trait_extractor import extract_personality_from_chat
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "AI Persona App is Live!"}

@app.get("/chat")
def chat_route(user_input: str, persona: str = "persona-configs/aarav.json"):
    response = chat_with_persona(user_input, persona)
    return {"persona_reply": response}

@app.post("/upload_chat/")
async def upload_chat(chat_text: str = Form(...)):
    cleaned = clean_chat_text(chat_text)
    traits = extract_personality_from_chat(cleaned)
    return {"profile_traits": traits}
