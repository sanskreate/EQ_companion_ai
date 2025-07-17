
import os
from dotenv import load_dotenv

# Adjust the path to your .env file as needed
load_dotenv(dotenv_path="C:/Users/sansk/PROJECTS/EQ_AGENT/key/.env")

from groq import Groq
groq_api_key = os.getenv("GROQ_API_KEY")

def extract_personality_from_chat(clean_text: str):
    prompt = f"""
    Analyze the following chat between a user and someone else. 
    Infer the user's personality traits, communication style, emotional needs, and possible attachment style.
    Respond in JSON format with keys: ["personality_traits", "tone", "communication_style", "emotional_needs", "attachment_style"].
    
    Chat:
    {clean_text}
    """

    client = Groq(api_key=groq_api_key)
    response = client.chat.completions.create(
        model="llama3-8b-8192",  # or another Groq-supported model
        messages=[
            {"role": "system", "content": "You are a relationship psychologist and NLP expert."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )

    return response.choices[0].message.content
