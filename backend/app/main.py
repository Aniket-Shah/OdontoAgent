from fastapi import FastAPI, UploadFile, File
from app.router.inference import router as inference_router

app = FastAPI()

app.include_router(inference_router)

@app.get("/")
def root():
    return {"status":"Dental AI API running"}
