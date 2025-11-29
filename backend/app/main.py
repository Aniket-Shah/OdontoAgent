from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware 
from app.router.auth import router as auth_router
from app.router.process import router as process_router
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key="MYSESSIONSECRET",
    session_cookie="session",
    max_age=86400,  # 1 day
    https_only=False,  # IMPORTANT for localhost
)
app.include_router(process_router, prefix="/api")
app.include_router(auth_router)

@app.get("/")
def root():
    return {"status": "Dental AI API running"}
