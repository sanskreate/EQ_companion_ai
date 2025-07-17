# User authentication and registration logic for FastAPI
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, Field
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os

# Secret key for JWT (in production, use env var)
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 week

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# In-memory user store (replace with DB in production)
users_db = {}

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3)
    email: EmailStr
    password: str = Field(..., min_length=6)
    dob: str
    gender: str
    preferred_gender: str = None
    personality: str
    love_language: str = None
    ideal_trait: str = None
    deal_breakers: str = None
    preferred_tone: str = None
    attachment_style: str = None

class UserOut(BaseModel):
    username: str
    email: EmailStr
    dob: str
    gender: str
    preferred_gender: str = None
    personality: str
    love_language: str = None
    ideal_trait: str = None
    deal_breakers: str = None
    preferred_tone: str = None
    attachment_style: str = None

class Token(BaseModel):
    access_token: str
    token_type: str

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/signup", response_model=UserOut)
def signup(user: UserCreate):
    if user.username in users_db:
        raise HTTPException(status_code=409, detail="Username already exists.")
    for u in users_db.values():
        if u['email'] == user.email:
            raise HTTPException(status_code=409, detail="Email already registered.")
    hashed = get_password_hash(user.password)
    user_dict = user.dict()
    user_dict['password'] = hashed
    users_db[user.username] = user_dict
    return UserOut(**user_dict)

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = users_db.get(form_data.username)
    if not user or not verify_password(form_data.password, user['password']):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token = create_access_token({"sub": user['username']})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
def get_me(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None or username not in users_db:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = users_db[username]
        return UserOut(**user)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
