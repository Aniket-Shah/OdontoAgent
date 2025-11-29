from fastapi import APIRouter, HTTPException, Response, Depends, Request
from jose import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from app.models import User
from app.db import get_db
from app.schemas import SignupSchema, LoginSchema, EmailSchema



router = APIRouter(prefix="/auth", tags=["auth"])

SECRET_KEY = "MYSECRET"
ALGORITHM = "HS256"
pwd_context = CryptContext(
    schemes=["bcrypt_sha256"],
    deprecated="auto"
)


# ---------------------------------------------------------
@router.post("/signup")
def signup(user: SignupSchema, db: Session = Depends(get_db)):
    

    try:
        db_user = db.query(User).filter(User.email == user.email).first()
        
    except Exception as e:
        
        raise HTTPException(500, str(e))

    if db_user:
        raise HTTPException(400, "User already exists")

    try:
        hashed_pass = pwd_context.hash(user.password)
        
    except Exception as e:
        
        raise HTTPException(500, str(e))

    new_user = User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        password=hashed_pass
    )

    try:
        db.add(new_user)
        db.commit()
    except Exception as e:
        
        raise HTTPException(500, str(e))

    return {"message": "Registration successful"}


# ---------------------------------------------------------
@router.post("/login")
def login(user: LoginSchema, request: Request, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(401, "Invalid credentials")

    # ✅ store in session
    request.session["user_email"] = db_user.email

    return {
        "message": "Login success",
        "user": {
            "name": db_user.name,
            "email": db_user.email,
            "phone": db_user.phone,
            "role": db_user.role,
        }
    }


# ---------------------------------------------------------
@router.post("/forgot-password")
def forgot(data: EmailSchema, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(User.email == data.email).first()
    if not db_user:
        raise HTTPException(404, "Email not found")

    return {"message": "Reset link sent!"}


# ---------------------------------------------------------
@router.post("/logout")
def logout(request: Request):
    request.session.clear()
    return {"message": "Logged out"}


#---------------------------------------------------------
@router.get("/me")
def me(request: Request):
    print("SESSION DATA:", request.session)  # debug
    email = request.session.get("user_email")
    if not email:
        raise HTTPException(401, "Not logged in")
    return {"email": email}