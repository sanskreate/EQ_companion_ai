from backend import users
# FastAPI backend entry point

from fastapi import FastAPI, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from backend.agents.persona_agent import chat_with_persona
from backend.utils.chat_parser import clean_chat_text
from backend.utils.trait_extractor import extract_personality_from_chat
from fastapi.middleware.cors import CORSMiddleware
import os
import json


app = FastAPI()
app.include_router(users.router)

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
    
@app.post("/create_persona/")
async def create_persona(persona: dict):
    name = persona.get("name")
    if not name:
        raise HTTPException(status_code=400, detail="Persona name is required.")
    persona_path = os.path.join("persona-configs", f"{name.lower()}.json")
    if os.path.exists(persona_path):
        raise HTTPException(status_code=409, detail="Persona with this name already exists.")
    with open(persona_path, "w", encoding="utf-8") as f:
        json.dump(persona, f, ensure_ascii=False, indent=2)
    return JSONResponse(content={"message": "Persona created successfully.", "persona_file": persona_path})
