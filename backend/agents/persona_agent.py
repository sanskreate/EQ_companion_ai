# Persona agent logic will go here
import os
from groq import Groq
from langchain.schema import HumanMessage, SystemMessage
from jinja2 import Template
import json
from dotenv import load_dotenv
import pathlib

# Load .env from the parent directory's 'key' folder

# Adjust the path to your .env file as needed
load_dotenv(dotenv_path="C:/Users/sansk/PROJECTS/EQ_AGENT/key/.env")

def load_persona(persona_file: str):
    with open(persona_file, "r") as f:
        persona = json.load(f)

    with open("backend/prompts/persona_template.txt", "r") as f:
        template = Template(f.read())

    system_prompt = template.render(**persona)

    return persona["name"], system_prompt

def chat_with_persona(user_input, persona_file):
    name, system_prompt = load_persona(persona_file)

    groq_api_key = os.getenv("GROQ_API_KEY")
    client = Groq(api_key=groq_api_key)
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_input}
    ]
    response = client.chat.completions.create(
        model="llama3-8b-8192",  # or another Groq-supported model
        messages=messages
    )
    return response.choices[0].message.content
