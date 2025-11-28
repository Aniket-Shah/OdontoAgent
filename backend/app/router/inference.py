from fastapi import APIRouter, UploadFile, File
from app.services.pipeline import full_pipeline
import cv2
import numpy as np

router = APIRouter(prefix="/api")

@router.post("/full-pipeline")
async def run_pipeline(file: UploadFile = File(...)):
    img_bytes = await file.read()
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    result = full_pipeline(img)
    return {"results": result}
