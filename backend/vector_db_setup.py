# ChromaDB setup logic will go here
import chromadb

chroma_client = chromadb.Client()

def get_or_create_collection(collection_name="user_chats"):
    return chroma_client.get_or_create_collection(name=collection_name)