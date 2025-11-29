from fastapi import APIRouter, UploadFile, File, Form
from PIL import Image, ImageDraw
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
import json, io, requests, base64, os, re
from bs4 import BeautifulSoup
from datetime import datetime

router = APIRouter()

# ----------------------------------------------
# extract file id from file url
# ----------------------------------------------
def extract_file_id(url: str) -> str | None:
    patterns = [
        r"id=([^&]+)",
        r"/d/([^/]+)",
        r"uc\?export=download&id=([^&]+)"
    ]

    for p in patterns:
        m = re.search(p, url)
        if m:
            return m.group(1)
    return None


# -------------------------------------------------
# read a Google Drive folder and get first file
# -------------------------------------------------
def extract_from_folder(folder_url: str):
    html = requests.get(folder_url).text
    soup = BeautifulSoup(html, "html.parser")

    for a in soup.find_all("a"):
        href = a.get("href", "")
        if "/file/d/" in href:
            return href.split("/d/")[1].split("/")[0]

    raise ValueError("No file found in the folder. Add at least one image.")


# ----------------------------------------------------
# main extraction method
# ----------------------------------------------------
def get_google_drive_file_id(url: str):
    if "/folders/" in url:
        return extract_from_folder(url)

    file_id = extract_file_id(url)
    if file_id:
        return file_id

    raise ValueError("Invalid Google Drive link")


# -------------------------------------------------
# YOLO conversion
# -------------------------------------------------
def yolo_to_xyxy(bbox, w, h):
    cx, cy, bw, bh = bbox
    return (
        int((cx - bw / 2) * w),
        int((cy - bh / 2) * h),
        int((cx + bw / 2) * w),
        int((cy + bh / 2) * h)
    )


# -------------------------------------------------
# MAIN API ROUTE
# -------------------------------------------------
@router.post("/draw")
async def draw_boxes(image_url: str = Form(...), data: UploadFile = File(...)):

    # Extract the file id
    try:
        file_id = get_google_drive_file_id(image_url)
    except Exception as e:
        return {"error": str(e)}

    direct_url = f"https://drive.google.com/uc?export=download&id={file_id}"

    # download image
    session = requests.Session()
    response = session.get(direct_url, allow_redirects=True)

    content_type = response.headers.get("Content-Type", "")

    if "image" not in content_type:
        return {
            "error": "Google Drive blocked the download.",
            "reason": "The file is not public.",
            "fix": "Right Click → Share → Anyone with link → Viewer",
            "received": content_type,
            "status": response.status_code,
            "direct_url": direct_url
        }

    img = Image.open(io.BytesIO(response.content)).convert("RGB")
    w, h = img.size

    # read YOLO JSON safely
    content = await data.read()

    try:
        parsed = json.loads(content)
    except:
        return {
            "error": "Uploaded file must be JSON",
            "hint": "Do NOT upload image here. Only JSON."
        }

    healthy = parsed[0].get("healthy_teeth", [])
    danger = parsed[0].get("danger_teeth", [])
    explanation = parsed[0].get("explanation", "")

    draw = ImageDraw.Draw(img)

    for item in healthy:
        x1, y1, x2, y2 = yolo_to_xyxy(item["yolo_bbox"], w, h)
        draw.rectangle([x1, y1, x2, y2], outline="green", width=4)

    for item in danger:
        x1, y1, x2, y2 = yolo_to_xyxy(item["yolo_bbox"], w, h)
        draw.rectangle([x1, y1, x2, y2], outline="red", width=4)

    os.makedirs("output", exist_ok=True)

    processed_path = f"output/processed_{file_id}.jpg"
    img.save(processed_path)

    # ---------------- PDF generation ----------------
    pdf_path = f"output/report_{file_id}.pdf"
    c = canvas.Canvas(pdf_path, pagesize=A4)
    width, height = A4

    c.setFont("Helvetica-Bold", 20)
    c.drawString(40, height - 50, "Dental Radiograph AI Report")

    c.setFont("Helvetica", 12)
    c.drawString(40, height - 75, f"Generated On: {datetime.now().strftime('%d-%m-%Y %H:%M')}")

    c.setFont("Helvetica-Bold", 14)
    c.drawString(40, height - 110, f"Healthy Teeth: {len(healthy)}")
    c.drawString(40, height - 130, f"Danger Teeth: {len(danger)}")

    c.drawImage(ImageReader(processed_path), 40, height - 500, width=500, preserveAspectRatio=True)

    text_obj = c.beginText(40, 250)
    text_obj.setFont("Helvetica", 12)

    for line in explanation.split("\n"):
        text_obj.textLine(line)

    c.drawText(text_obj)
    c.save()

    # return encoded image
    with open(processed_path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode()

    return {
        "status": "success",
        "file_id": file_id,
        "processed_image": b64,
        "pdf_path": pdf_path
    }
