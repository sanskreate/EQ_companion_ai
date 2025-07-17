# Persona agent logic will go here
import os
from groq import Groq
from langchain.schema import HumanMessage, SystemMessage
from jinja2 import Template
import json
from dotenv import load_dotenv
import pathlib

# Adjust the path to your .env file as needed
load_dotenv(dotenv_path="C:/Users/sansk/PROJECTS/EQ_AGENT/key/.env")


def build_system_prompt(persona: dict):
    with open("backend/prompts/persona_template.txt", "r") as f:
        template = Template(f.read())
    return template.render(**persona)

def load_persona(persona_file: str):
    with open(persona_file, "r") as f:
        persona = json.load(f)
    system_prompt = build_system_prompt(persona)
    return persona["name"], system_prompt

# For dynamic persona dict (not file)
def chat_with_persona_system_prompt(user_input, system_prompt):
    groq_api_key = os.getenv("GROQ_API_KEY")
    client = Groq(api_key=groq_api_key)
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_input}
    ]
    response = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=messages
    )
    return response.choices[0].message.content

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
